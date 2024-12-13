import { expect, TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions details',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(async ({ detailsPage, data }) => {
        await detailsPage.navigate(data.details.id);
      });

      test('should display correct transaction details', async ({
        detailsPage,
        data,
      }) => {
        const details = await detailsPage.getDetails();
        expect(details['Category:']).toEqual(data.details.category);
        expect(details['Description:']).toEqual(data.details.description);
        expect(details['Status:']).toEqual(data.details.status);
      });
    }
  );
}
