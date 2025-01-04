import { expect, TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions details',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(async ({ detailsPage, detailsData }) => {
        await detailsPage.navigate(detailsData.id);
      });

      test('should display correct transaction details', async ({
        detailsPage,
        detailsData,
      }) => {
        const details = await detailsPage.getDetails();
        expect(details['Category:']).toEqual(detailsData.category);
        expect(details['Description:']).toEqual(detailsData.description);
        expect(details['Status:']).toEqual(detailsData.status);
      });
    }
  );
}
