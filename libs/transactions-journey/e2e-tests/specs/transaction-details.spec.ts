import { expect, TestType } from '@playwright/test';
import {
  TransactionFixture,
  TransactionDetailDataType,
} from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe('Transactions', () => {
    test.describe('Transaction details', () => {
      let data: TransactionDetailDataType;

      test.beforeEach(async ({ detailsPage, detailsData }) => {
        data = detailsData;
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
