import { test } from '../../fixtures/test';
import { expect } from '../../expect/expect';
import { TestInfo } from '@playwright/test';

test.describe(
  'Make a Transfer Page A11y tests',
  { tag: ['@a11y', '@e2e', '@mocks'] },
  () => {
    test.beforeEach(async ({ makeTransferPage }) => {
      await makeTransferPage.open();
      await expect(makeTransferPage.pageHeader).toBeVisible();
    });

    test(
      'Validate Make a Transfer page accessibility',
      { tag: ['@axe'] },
      async ({ makeTransferPage }, testInfo: TestInfo) => {
        await expect({
          page: makeTransferPage.page,
          testInfo: testInfo,
        }).toBeAccessible();
      }
    );

    test(
      'Validate Make a Transfer tab Order',
      { tag: ['@tab-order'] },
      async ({ makeTransferPage, page }) => {
        await makeTransferPage.toAccount.element.focus();
        await expect(makeTransferPage.element).toHaveFocusOrder([
          { tagName: 'input', textContent: '' }, // To Account
          { tagName: 'select', textContent: 'USD USD EUR' }, // Currency Input
          { tagName: 'input', textContent: '' }, // Integer Input
          { tagName: 'input', textContent: '' }, // Decimal Input
          { tagName: 'button', textContent: 'Submit' }, // Submit Button
        ]);
      }
    );

    test(
      'Validate Make a Transfer page reflow',
      { tag: ['@reflow'] },
      async ({ makeTransferPage, page }) => {
        await page.setViewportSize({ width: 320, height: 256 });
        const locator = makeTransferPage.locator('bb-transfer-journey');
        await expect(locator).not.toOverflowViewPort();
      }
    );
  }
);
