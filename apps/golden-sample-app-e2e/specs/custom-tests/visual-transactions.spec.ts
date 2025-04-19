import { test } from '../../test-runner/test-runner';
import { expect } from '@playwright/test';

test.describe('@feature @responsive @visual Transaction page tests', () => {
  // `visual` is a fixture that provides the `testFullPage` and `testWithMask` functions in the examples below.
  test('Validate responsiveness of the transactions page', async ({
    transactionsPage,
    visual,
  }) => {
    await transactionsPage.open();
    await test.step(`Wait for page to be opened`, async () => {
      await expect(transactionsPage.pageHeader).toBeVisible();
    });
    await test.step(`Transaction page full`, async () => {
      await visual.testFullPage('transactions-page-full');
    });
    await test.step(`Transaction page with masked data`, async () => {
      await visual.testWithMask('transactions-page-with-masked-data', {
        mask: ['.transaction-account-number'],
      });
    });
  });
});
