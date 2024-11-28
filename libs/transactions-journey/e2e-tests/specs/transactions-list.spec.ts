import { expect, TestType } from '@playwright/test';
import { TransactionsListPage } from '../page-object/transactions-list.page';
import { TRANSACTIONS_LIST } from '../data/transactions-list.data';

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
        await listPage.searchTransactions(data.searchTerm);
        const transactionsNumber = await listPage.getTransactionsNumber();
        expect(transactionsNumber).toEqual(data.searchedSize);
      });
    });
  });
}
