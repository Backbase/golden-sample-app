import {
  expect as baseExpect,
  Locator,
  Page,
  TestInfo,
} from '@playwright/test';
import { A11yScanner, timeID } from '@backbase/e2e-tests';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeAccessible(options?: {
        include?: Locator | string;
        disableRules?: string[];
      }): R;
    }
  }
}

export const a11yExpect = baseExpect.extend({
  async toBeAccessible(
    pageObject: { page: Page; testInfo: TestInfo },
    options?: {
      include?: Locator | string;
      disableRules?: string[];
    }
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
