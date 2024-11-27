import { expect, TestType } from '@playwright/test';
import { TransactionDetailsPage } from '../page-object/transaction-details.page';
import { TRANSACTION_DETAILS } from '../data/transaction-details.data';

export interface TransactionDetailsFixture {
  page: TransactionDetailsPage;
  data?: typeof TRANSACTION_DETAILS;
}

export function testTransactionDetails(
  test: TestType<TransactionDetailsFixture, TransactionDetailsFixture>
) {
  test.describe('Transactions', () => {
    test.describe('Transaction details', () => {
      let detailsData: typeof TRANSACTION_DETAILS;

      test.beforeEach(async ({ page, data }) => {
        detailsData = data ?? TRANSACTION_DETAILS;
        await page.navigate(detailsData.id);
      });

      test('should display correct transaction details', async ({ page }) => {
        const details = await page.getDetails();
        expect(details['Category']).toEqual(detailsData.category);
        expect(details['Description']).toEqual(detailsData.description);
        expect(details['Status']).toEqual(detailsData.status);
      });
    });
  });
}
