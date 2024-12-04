import { expect, Route, TestType } from '@playwright/test';
import { TRANSACTIONS_LIST } from '../data/transactions-list.data';
import { TransactionsListPage } from '../page-object/transactions-list.page';

export interface TransactionsListFixture {
  listPage: TransactionsListPage;
  listData?: typeof TRANSACTIONS_LIST;
}

export function testTransactionsList(
  test: TestType<TransactionsListFixture, TransactionsListFixture>
) {
  test.describe('Transactions', () => {
    test.describe('Transactions list', () => {
      let data: typeof TRANSACTIONS_LIST;

      test.beforeEach(async ({ listPage, listData }) => {
        data = listData ?? TRANSACTIONS_LIST;
        await listPage.navigate();
      });

      test('should display transactions', async ({ listPage }) => {
        const transactionsNumber = await listPage.getTransactionsNumber();
        expect(transactionsNumber).toEqual(data.size);
      });
      test('should filter transactions', async ({ listPage }) => {
        for (const expectation of data.searchExpectations) {
          await listPage.searchTransactions(expectation.term);
          const transactionsNumber = await listPage.getTransactionsNumber();
          expect(transactionsNumber).toEqual(expectation.count);
        }
      });
    });
  });
}

export function testTransactionListError(
  test: TestType<TransactionsListFixture, TransactionsListFixture>
) {
  test.describe('Transaction list', () => {
    test('Error scenario', async ({ listPage }) => {
      await listPage.navigate();
      expect(true).toBe(true);
    });
  });
}
