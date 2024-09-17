import { test } from '../page-objects/test-runner';

test.beforeEach(async ({ page }) => {
  await page.goto('transactions');
});
test.describe.configure({ mode: 'parallel' });

test.describe('@feature @responsive @visual Transaction page tests', () => {
  test('Validate responsiveness of the transactions page', async ({
    page,
    visual,
  }) => {
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
