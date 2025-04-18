import type { Result, NodeResult } from 'axe-core';
import { Page } from '@playwright/test';

export const getSelectorsForViolatedElements = (
  violations: Result[]
): string[] => {
  const selectors: string[] = [];
  violations.forEach((violation) => {
    violation.nodes.forEach((node) => {
      selectors.push(node.target[0].toString());
    });
  });
  return selectors;
};

export const getViolationsNodes = (violations: Result[]): NodeResult[] => {
  const nodes: NodeResult[] = [];
  violations.forEach((violation) => {
    violation.nodes.forEach((node) => {
      nodes.push(node);
    });
  });
  return nodes;
};

export const modifyViewPortSize = async (page: Page): Promise<void> => {
  const modalWindowSelector = '.modal-content-container';
  if (await page.locator(modalWindowSelector).isVisible()) {
    const currentViewportSize = page.viewportSize();
    const modalWindowHeight: number = await page.evaluate(
      `document.querySelector('${modalWindowSelector}').offsetHeight`
    );

    if (currentViewportSize && modalWindowHeight > currentViewportSize.height) {
      await page.setViewportSize({
        height: modalWindowHeight + 100,
        width: currentViewportSize.width,
      });
    }
  }
};

const getOffsetValuesRecursive = (element: HTMLElement | null) => {
  if (element == null) return null;
  let current: HTMLElement = element;
  while (current.offsetParent) {
    current = current.offsetParent as HTMLElement;
  }
  return current;
};

const generateHighlightingStyle = (
  position: { offsetTop: number; offsetLeft: number },
  size: { height: number; width: number }
): string => {
  return `border-width: 1px border-style: solid; border-color: #eb34c9; box-shadow: 0 0 10px 4px #e267ff; height: ${size.height}px; width: ${size.width}px; 
    position: absolute; left: ${position.offsetLeft}px; top: ${position.offsetTop}px; z-index: 9999999;`;
};

/**
 * Highlight violated elements.
 * Throw an error if a scan not been run yet.
 * ```js
 * Usage
 * const a11yScanner = new AccessibilityScanner(page);
 * await a11yScanner.scanPage();
 * await a11yScanner.highlightViolations();
 * ```
 */
export const highlightViolations = async (
  page: Page,
  violations: string[]
): Promise<void> => {
  for (const selector of violations) {
    const elementPosition = await page.evaluate(
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (s) => getOffsetValuesRecursive(document.querySelector(s)),
      selector
    );

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    const elementSize = await page.evaluate((s) => {
      return {
        height: (document.querySelector(s) as HTMLElement).offsetHeight,
        width: (document.querySelector(s) as HTMLElement).offsetWidth,
      };
    }, selector);

    if (!elementPosition) return;
    const highlightStyle = generateHighlightingStyle(elementPosition, elementSize);

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    await page.evaluate((style) => {
      const highlightedElement = document.createElement('div');
      highlightedElement.setAttribute('style', style);
      document.body.appendChild(highlightedElement);
    }, highlightStyle);
  }
};

/**
 * Highlight violated elements.
 * Throw an error if a scan not been run yet.
 * ```js
 * Usage
 * const a11yScanner = new AccessibilityScanner(page);
 * await a11yScanner.scanPage();
 * await a11yScanner.highlightViolations();
 * ```
 */
export const highlightViolationsOnPage = async (
  page: Page,
  violations: Result[]
): Promise<void> => {
  await modifyViewPortSize(page);
  await highlightViolations(page, getSelectorsForViolatedElements(violations));
};

export const shortA11YReport = (violations: Result[]): string => {
  let report = '';
  violations.forEach((violation, violationIndex) => {
    report += `\n${violationIndex + 1} ${violation.help}\n`;
    violation.nodes.forEach((node, nodeIndex) => {
      report += `${violationIndex + 1}.${nodeIndex + 1}. ${node.html}\n${
        node.failureSummary
      }\n`;
    });
  });

  return report;
};
