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
        async ({ detailsPage, detailsData, detailsMocksSetup }) => {
          await detailsMocksSetup();
          await detailsPage.navigate(detailsData.id);
        }
      );

      test('should display correct transaction details', async ({
        detailsPage,
        detailsData,
      }) => {
        const details = await detailsPage.getDetails();
        await expect(details['Category:']).toEqual(detailsData.category);
        await expect(details['Description:']).toEqual(detailsData.description);
        await expect(details['Status:']).toEqual(detailsData.status);
      });
    }
  );
}
