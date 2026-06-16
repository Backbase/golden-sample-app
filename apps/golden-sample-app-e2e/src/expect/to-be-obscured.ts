import { Locator, expect as baseExpect } from '@playwright/test';
import { attachDebugScreenshot } from './matcher-shared';

export type ObscuredAnalysis = {
  obscured: boolean;
  blockerLabel: string | null;
};

/** Runs in the browser — passed to locator.evaluate(). */
function analyzeObscuration(el: Element): ObscuredAnalysis {
  const rect = el.getBoundingClientRect();
  // Zero area means the element is not rendered — that's a visibility problem,
  // not an occlusion one, so it is out of scope for SC 2.4.11.
  if (rect.width === 0 || rect.height === 0) {
    return { obscured: false, blockerLabel: null };
  }

  // Drill through open shadow roots to find the truly topmost element.
  const deepElementFromPoint = (x: number, y: number): Element | null => {
    let node = document.elementFromPoint(x, y);
    while (node?.shadowRoot) {
      const inner = node.shadowRoot.elementFromPoint(x, y);
      if (!inner || inner === node) break;
      node = inner;
    }
    return node;
  };

  // Composed-tree ancestor check (crosses shadow boundaries).
  const isSelfOrInside = (node: Element | null): boolean => {
    let cur: Node | null = node;
    while (cur) {
      if (cur === el) return true;
      cur = cur instanceof ShadowRoot ? cur.host : cur.parentNode;
    }
    return false;
  };

  const inset = 1;
  const candidatePoints: Array<[number, number]> = [
    [rect.left + rect.width / 2, rect.top + rect.height / 2],
    [rect.left + inset, rect.top + inset],
    [rect.right - inset, rect.top + inset],
    [rect.left + inset, rect.bottom - inset],
    [rect.right - inset, rect.bottom - inset],
  ];

  // Only points inside the viewport can be hit-tested reliably.
  const points = candidatePoints.filter(
    ([x, y]) =>
      x >= 0 && y >= 0 && x <= window.innerWidth && y <= window.innerHeight
  );
  if (points.length === 0) {
    return { obscured: false, blockerLabel: null };
  }

  // SC 2.4.11 (Minimum) only fails when the element is *entirely* hidden, so it
  // is obscured only when none of the sampled points reach the element itself.
  let topBlocker: Element | null = null;
  const anyPartVisible = points.some(([x, y]) => {
    const hit = deepElementFromPoint(x, y);
    if (isSelfOrInside(hit)) return true;
    if (hit && !topBlocker) topBlocker = hit;
    return false;
  });

  const obscured = !anyPartVisible;

  let blockerLabel: string | null = null;
  if (obscured && topBlocker) {
    // Use getAttribute('class') — Element.className is an SVGAnimatedString
    // (not a string) on SVG nodes and would throw on .trim().
    const classAttr = (topBlocker as Element).getAttribute('class');
    const className = classAttr
      ? `.${classAttr.trim().split(/\s+/).join('.')}`
      : '';
    blockerLabel = `${(
      topBlocker as Element
    ).tagName.toLowerCase()}${className}`;
  }

  return { obscured, blockerLabel };
}

/** Returns whether the element is entirely covered by other content. */
export async function analyzeElementObscured(
  locator: Locator
): Promise<ObscuredAnalysis> {
  // Bring the element into the viewport so the hit-test points are valid.
  await locator.scrollIntoViewIfNeeded();
  return locator.evaluate(analyzeObscuration);
}

export const obscuredExpect = baseExpect.extend({
  async toBeObscured(locator: Locator, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? this.timeout ?? 5000;
    const deadline = Date.now() + timeout;
    const intervals = [100, 250, 500, 1000];

    // Auto-retry like a built-in assertion: re-sample until the (possibly
    // negated) expectation is satisfied or the timeout elapses. The matcher
    // fails when `obscured === isNot`, so we keep polling while that holds.
    let analysis = await analyzeElementObscured(locator);
    for (let attempt = 0; analysis.obscured === this.isNot; attempt++) {
      if (Date.now() >= deadline) break;
      const wait = intervals[Math.min(attempt, intervals.length - 1)];
      await new Promise((resolve) => setTimeout(resolve, wait));
      analysis = await analyzeElementObscured(locator);
    }

    const { obscured, blockerLabel } = analysis;

    if (obscured) {
      await attachScreenshot(locator);
    }

    const el = await locator.textContent();

    return {
      pass: obscured,
      name: 'toBeObscured',
      message: () => {
        const blocker = blockerLabel ? ` (covered by ${blockerLabel})` : '';

        return this.isNot
          ? `Expected ${el} element not to be obscured, but it is covered by other content ${blocker}`
          : `Expected ${el} element to be obscured, but it is fully visible`;
      },
      log: blockerLabel ? [`covered by ${blockerLabel}`] : [],
    };
  },
});

async function attachScreenshot(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await attachDebugScreenshot(locator, [{ selector: ':scope' }], {
    debugId: 'a11y-obscured-debug',
    label: 'obscured',
    attachmentName: 'focus-obscured.png',
  });
}
