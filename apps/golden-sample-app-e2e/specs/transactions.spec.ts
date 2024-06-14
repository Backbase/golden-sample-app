import { test } from '../page-objects/test-runner';

test.describe.configure({ mode: 'parallel' });

test.describe('@feature @responsive @visual Transaction page tests', () => {
  test('Validate responsiveness of the transactions page', async ({ page, visual }) => {
    await page.goto('transactions');
    await visual.testFullPage('transactions-page');
  });
});
