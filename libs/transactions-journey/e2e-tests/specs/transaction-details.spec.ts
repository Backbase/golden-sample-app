import { expect, TestType } from '@playwright/test';
import { TransactionDetailsPage } from '../page-object/transaction-details.page';
import { TRANSACTION_DETAILS } from '../data/transaction-details.data';

export interface TransactionDetailsFixture {
  detailsPage: TransactionDetailsPage;
  detailsData?: typeof TRANSACTION_DETAILS;
}

export function testTransactionDetails(
  test: TestType<TransactionDetailsFixture, TransactionDetailsFixture>
) {
  test.describe('Transactions', () => {
    test.describe('Transaction details', () => {
      let data: typeof TRANSACTION_DETAILS;

      test.beforeEach(async ({ detailsPage, detailsData }) => {
        data = detailsData ?? TRANSACTION_DETAILS;
        await detailsPage.navigate(data.id);
      });

      test('should display correct transaction details', async ({
        detailsPage,
      }) => {
        const details = await detailsPage.getDetails();
        expect(details['Category:']).toEqual(data.category);
        expect(details['Description:']).toEqual(data.description);
        expect(details['Status:']).toEqual(data.status);
      });
    });
  });
}
