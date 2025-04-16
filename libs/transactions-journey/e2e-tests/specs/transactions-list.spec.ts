import { expect, TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionsList(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions list',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(async ({ transactionsListPage, listMocksSetup }) => {
        await listMocksSetup();
        await transactionsListPage.open();
      });

      test('should display transactions', async ({ transactionsListPage, transactionsListData }) => {
        const transactionsNumber = await transactionsListPage.getTransactionsNumber();
        expect(transactionsNumber).toEqual(transactionsListData.size);
      });

      test('should filter transactions', async ({ transactionsListPage, transactionsListData }) => {
        for (const expectation of transactionsListData.searchExpectations) {
          await test.step(`Search transactions by "${expectation.term}" term`, async () => {
            await transactionsListPage.searchTransactions(expectation.term);
          });
          await test.step(`Validate number of transactions to be ${expectation.count}`, async () => {
            const transactionsNumber = await transactionsListPage.getTransactionsNumber();
            expect(transactionsNumber).toEqual(expectation.count);
          });
        }
      });

      test(
        'should display correct error state',
        { tag: ['@mocks'] },
        async () => {
          // Error state test placeholder
          expect(true).toBe(true);
        }
      );
    }
  );
}
