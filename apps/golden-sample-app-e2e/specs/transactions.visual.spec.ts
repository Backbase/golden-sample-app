import { test } from '../page-objects/test-runner';

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/transactions`);
});
test.describe.configure({ mode: 'parallel' });

test.describe('@feature @responsive @visual Transaction page tests', () => {
  // `visual` is a fixture that provides the `testFullPage` and `testWithMask` functions in the examples below.
  test('Validate responsiveness of the transactions page', async ({
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
