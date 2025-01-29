import { expect, Locator, Page, TestInfo } from '@playwright/test';
import { highlightViolationsOnPage } from './a11y-violations-utility';
import { timeID } from '../time-utils';
import { A11yScanner } from './a11y-scanner';

export const initA11yExpect = () => {};

expect.extend({
  async toBeAccessible(
    pageObject: { page: Page; testInfo: TestInfo },
    options?: { include: Locator | string; disableRules: [] }
  ): Promise<{ message: () => string; pass: boolean }> {
    const axeScanner = new A11yScanner(
      pageObject.page,
      pageObject.testInfo,
      options
    );
    await axeScanner.analyze();

    if (axeScanner.hasViolations) {
      await axeScanner.attachResultsToPlaywrightReport();
      axeScanner.saveA11yResultsToFile(`a11y-report-${timeID()}.html`);
      // await highlightViolationsOnPage(pageObject.page, axeScanner.violations);
    }
    return axeScanner.validateResult();
  },
});
