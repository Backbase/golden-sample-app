import { Locator, Page, test } from '@playwright/test';

export type MatcherExclusion = Locator | string;

export const DEFAULT_TOLERANCE_PX = 1;
const SCREENSHOT_HEIGHT_PADDING_PX = 32;

export async function relativeSelectorFromRoot(
  root: Locator,
  target: Locator
): Promise<string | null> {
  const rootHandle = await root.elementHandle();
  if (!rootHandle) return null;

  try {
    return await target.evaluate((el, rootEl) => {
      if (!(rootEl instanceof Element) || !rootEl.contains(el)) return null;
      if (el === rootEl) return ':scope';

      const segments: string[] = [];
      let node: Element | null = el;

      while (node && node !== rootEl) {
        const parent: Element | null = node.parentElement;
        if (!parent) return null;

        const index = Array.from(parent.children).indexOf(node) + 1;
        segments.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`);
        node = parent;
      }

      return segments.join(' > ');
    }, rootHandle);
  } finally {
    await rootHandle.dispose();
  }
}

export async function resolveExclusionSelectors(
  root: Locator,
  exclusions: MatcherExclusion[]
): Promise<string[]> {
  const resolved: string[] = [];

  for (const exclusion of exclusions) {
    if (typeof exclusion === 'string') {
      resolved.push(exclusion);
      continue;
    }

    const selector = await relativeSelectorFromRoot(root, exclusion);
    if (selector) resolved.push(selector);
  }

  return resolved;
}

/** Runs in the browser — passed to locator.evaluate(). */
function applyDebugHighlights(
  root: Element,
  args: { selectors: string[]; debugId: string; label: string }
): void {
  document.getElementById(args.debugId)?.remove();

  const debugRoot = document.createElement('div');
  debugRoot.id = args.debugId;
  debugRoot.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';

  for (const selector of args.selectors) {
    const el = selector === ':scope' ? root : root.querySelector(selector);
    if (!(el instanceof HTMLElement)) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    const overlay = document.createElement('div');
    overlay.setAttribute('data-a11y-debug-overlay', selector);
    overlay.style.cssText = [
      'position:fixed',
      `left:${rect.left}px`,
      `top:${rect.top}px`,
      `width:${rect.width}px`,
      `height:${rect.height}px`,
      'border:4px dashed #c62828',
      'box-sizing:border-box',
      'pointer-events:none',
      'box-shadow:0 0 0 2px #fff, 0 0 8px #c62828',
    ].join(';');

    const tag = document.createElement('span');
    tag.textContent = args.label;
    tag.style.cssText = [
      'position:absolute',
      'top:-1.4rem',
      'left:0',
      'padding:0.1rem 0.35rem',
      'background:#c62828',
      'color:#fff',
      'font:600 11px/1.2 sans-serif',
      'white-space:nowrap',
    ].join(';');
    overlay.appendChild(tag);
    debugRoot.appendChild(overlay);
  }

  document.body.appendChild(debugRoot);
}

/** Runs in the browser — passed to page.evaluate(). */
function measureContentHeight(): number {
  window.scrollTo(0, 0);

  for (const el of Array.from(document.querySelectorAll('*'))) {
    if (el instanceof HTMLElement && el.scrollTop > 0) {
      el.scrollTop = 0;
    }
  }

  const heights: number[] = [
    window.innerHeight,
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  ];

  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    heights.push(rect.bottom);
  }

  return Math.ceil(Math.max(...heights));
}

/** Runs in the browser — passed to page.evaluate(). */
function removeDebugHighlights(debugId: string): void {
  document.getElementById(debugId)?.remove();
}

export type DebugScreenshotOptions = {
  debugId: string;
  label: string;
  attachmentName: string;
};

export type DebugScreenshotIssue = { selector: string };

async function captureDebugScreenshot(
  page: Page,
  applyHighlights: () => Promise<void>,
  options: DebugScreenshotOptions
): Promise<void> {
  const originalViewport =
    page.viewportSize() ??
    (await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    })));

  const contentHeight = await page.evaluate(measureContentHeight);
  const expandedHeight = Math.max(
    contentHeight + SCREENSHOT_HEIGHT_PADDING_PX,
    originalViewport.height
  );

  await page.setViewportSize({
    width: originalViewport.width,
    height: expandedHeight,
  });

  await page.waitForFunction(
    (minHeight) => document.documentElement.clientHeight >= minHeight,
    expandedHeight
  );

  try {
    await applyHighlights();

    const screenshot = await page.screenshot();
    await test.info().attach(options.attachmentName, {
      body: screenshot,
      contentType: 'image/png',
    });
  } finally {
    await page.evaluate(removeDebugHighlights, options.debugId);
    await page.setViewportSize(originalViewport);
  }
}

export async function attachDebugScreenshot(
  root: Locator,
  issues: DebugScreenshotIssue[],
  options: DebugScreenshotOptions
): Promise<void> {
  const page = root.page();
  const selectors = issues.map((issue) => issue.selector);

  await captureDebugScreenshot(
    page,
    () =>
      root.evaluate(applyDebugHighlights, {
        selectors,
        debugId: options.debugId,
        label: options.label,
      }),
    options
  );
}
