import { Locator, expect as baseExpect } from '@playwright/test';
import {
  attachDebugScreenshot,
  DEFAULT_TOLERANCE_PX,
  MatcherExclusion,
  resolveExclusionSelectors,
} from './matcher-shared';

export type TextOutsideBoxExclusion = MatcherExclusion;

/** Serializable text-outside-box report — locators are rebuilt from `selector` + root. */
export type TextOutsideBoxIssue = {
  /** CSS selector relative to the root locator (starts with `:scope` for the root itself). */
  selector: string;
  text: string;
  boxRight: number;
  textRight: number;
  boxBottom: number;
  textBottom: number;
};

type TextOutsideBoxScanResult = TextOutsideBoxIssue[];

/** Runs in the browser — passed to locator.evaluate(). */
function scanTextOutsideBoxIssues(
  root: Element,
  args: { tolerance: number; exclusionSelectors: string[] }
): TextOutsideBoxScanResult {
  const { tolerance, exclusionSelectors } = args;

  const relativeSelector = (el: Element): string => {
    if (el === root) return ':scope';

    const segments: string[] = [];
    let node: Element | null = el;

    while (node && node !== root) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;

      const index = Array.from(parent.children).indexOf(node) + 1;
      segments.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`);
      node = parent;
    }

    return segments.join(' > ');
  };

  const isVisible = (el: Element): boolean => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;

    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  };

  const isExcluded = (el: Element): boolean => {
    for (const sel of exclusionSelectors) {
      const excludedElements =
        sel === ':scope' ? [root] : Array.from(root.querySelectorAll(sel));

      for (const excluded of excludedElements) {
        if (el === excluded || excluded.contains(el)) {
          return true;
        }
      }
    }

    return false;
  };

  const getTextOutsideBoxIssue = (
    el: Element
  ): Omit<TextOutsideBoxIssue, 'selector'> | null => {
    const box = el.getBoundingClientRect();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!(node.textContent || '').trim()) continue;

      const range = document.createRange();
      range.selectNodeContents(node);
      const text = range.getBoundingClientRect();

      if (
        text.right > box.right + tolerance ||
        text.left < box.left - tolerance ||
        text.bottom > box.bottom + tolerance ||
        text.top < box.top - tolerance
      ) {
        return {
          text: (node.textContent || '').trim().slice(0, 50),
          boxRight: Math.round(box.right),
          textRight: Math.round(text.right),
          boxBottom: Math.round(box.bottom),
          textBottom: Math.round(text.bottom),
        };
      }
    }

    return null;
  };

  const isStrictAncestorSelector = (
    ancestor: string,
    descendant: string
  ): boolean => {
    if (ancestor === descendant) return false;
    if (descendant === ':scope') return false;
    if (ancestor === ':scope') return true;

    return descendant.startsWith(`${ancestor} > `);
  };

  const keepLeafOffenders = (
    allIssues: TextOutsideBoxScanResult
  ): TextOutsideBoxScanResult =>
    allIssues.filter(
      (candidate) =>
        !allIssues.some(
          (other) =>
            candidate !== other &&
            isStrictAncestorSelector(candidate.selector, other.selector)
        )
    );

  const issues: TextOutsideBoxScanResult = [];

  for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
    if (!isVisible(el) || isExcluded(el)) continue;

    const issue = getTextOutsideBoxIssue(el);
    if (!issue) continue;

    issues.push({
      selector: relativeSelector(el),
      ...issue,
    });
  }

  return keepLeafOffenders(issues);
}

/** Scan a root locator and return elements whose text exceeds their box. */
export async function findTextOutsideBoxIssues(
  root: Locator,
  exclusions: TextOutsideBoxExclusion[] = [],
  tolerance = DEFAULT_TOLERANCE_PX
): Promise<TextOutsideBoxIssue[]> {
  const exclusionSelectors = await resolveExclusionSelectors(root, exclusions);

  return root.evaluate(scanTextOutsideBoxIssues, {
    tolerance,
    exclusionSelectors,
  });
}

function formatTextOutsideBoxIssues(issues: TextOutsideBoxIssue[]): string {
  return issues
    .map(
      (issue) =>
        `  ${issue.selector}\n` +
        `    text: "${issue.text}"\n` +
        `    box right/bottom: ${issue.boxRight}px / ${issue.boxBottom}px\n` +
        `    text right/bottom: ${issue.textRight}px / ${issue.textBottom}px`
    )
    .join('\n\n');
}

export const textOutsideBoxExpect = baseExpect.extend({
  async toHaveElementsWithTextOutsideTheBox(
    root: Locator,
    exclude: TextOutsideBoxExclusion[] = [],
    options?: { tolerance?: number }
  ) {
    const tolerance = options?.tolerance ?? DEFAULT_TOLERANCE_PX;
    const issues = await findTextOutsideBoxIssues(root, exclude, tolerance);
    const pass = issues.length === 0;

    if (!pass) {
      await attachDebugScreenshot(root, issues, {
        debugId: 'a11y-text-outside-box-debug',
        label: 'text outside box',
        attachmentName: 'text-outside-box.png',
      });
    }

    return {
      pass: this.isNot ? !pass : pass,
      name: 'toNotHaveElementsWithTextOutsideTheBox',
      expected: [],
      actual: issues,
      message: () => {
        if (this.isNot) {
          return pass
            ? `Expected elements with text outside their box inside root, but found none`
            : `Expected no text-outside-box issues, but found ${
                issues.length
              }:\n\n${formatTextOutsideBoxIssues(issues)}`;
        }

        return `Expected no elements with text outside their box inside root, but found ${
          issues.length
        }:\n\n${formatTextOutsideBoxIssues(issues)}`;
      },
    };
  },
});
