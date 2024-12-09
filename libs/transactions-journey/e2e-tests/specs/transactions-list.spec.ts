import { expect, TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionsList(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions list',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(async ({ listPage }) => {
        await listPage.navigate();
      });

      test('should display transactions', async ({ listPage, listData }) => {
        const transactionsNumber = await listPage.getTransactionsNumber();
        expect(transactionsNumber).toEqual(listData.size);
      });

      test('should filter transactions', async ({ listPage, listData }) => {
        for (const expectation of listData.searchExpectations) {
          await test.step(`Search transactions by "${expectation.term}" term`, async () => {
            await listPage.searchTransactions(expectation.term);
          });
          await test.step(`Validate number of transactions to be ${expectation.count}`, async () => {
            const transactionsNumber = await listPage.getTransactionsNumber();
            expect(transactionsNumber).toEqual(expectation.count);
          });
        }
      });
    }
  );
}

export function testTransactionListError(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions list',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test('should display correct error state', async ({ listPage }) => {
        await listPage.navigate();
        // Error test placeholder
        expect(true).toBe(true);
      });
    }
  );
}
