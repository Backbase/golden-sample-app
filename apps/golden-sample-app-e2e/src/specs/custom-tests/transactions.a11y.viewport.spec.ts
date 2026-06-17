import { test } from '../../fixtures/test';
import { expect } from '../../expect/expect';

test.describe(
  'Transaction Page A11y Viewport tests',
  { tag: ['@a11y', '@e2e', '@mocks', '@reflow'] },
  () => {
    test.use({ viewport: { width: 320, height: 256 } });

    test.beforeEach(async ({ transactionsPage }) => {
      await transactionsPage.open();
      await expect(transactionsPage.pageHeader).toBeVisible();
      await expect(transactionsPage.transactions.element.first()).toBeVisible();
    });

    test('Validate Overflows for transactions list', async ({ page }) => {
      const transactionsView = page.locator('bb-transactions-view');

      await test.step('Validate Overflows for transactions list', async () => {
        await expect(transactionsView).not.toOverflowViewPort();
      });
    });
  }
);
