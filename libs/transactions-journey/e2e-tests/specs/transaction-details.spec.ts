import { expect, TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions details',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(
        async ({ transactionsDetailsPage, detailsMocksSetup }) => {
          await detailsMocksSetup();
          await transactionsDetailsPage.open();
        }
      );

      test('should display correct transaction details', async ({
        transactionsDetailsPage,
        transactionsDetailsData,
        transactionsListPage
      }) => {
        await transactionsListPage.transaction.click();
        const details = await transactionsDetailsPage.getDetails();
        await expect(details['Category:']).toEqual(transactionsDetailsData.category);
        await expect(details['Description:']).toEqual(transactionsDetailsData.description);
        await expect(details['Status:']).toEqual(transactionsDetailsData.status);
      });
    }
  );
}
