import { expect, TestType } from '@playwright/test';
import { TransactionsListPage } from '../page-object/transactions-list.page';
import { TRANSACTIONS_LIST } from '../data/transactions-list.data';

export interface TransactionsListFixture {
  page: TransactionsListPage;
  data?: typeof TRANSACTIONS_LIST;
}

export function testTransactionsList(
  test: TestType<TransactionsListFixture, TransactionsListFixture>
) {
  test.describe('Transactions', () => {
    test.describe('Transactions list', () => {
      let listData: typeof TRANSACTIONS_LIST;

      test.beforeEach(async ({ page, data }) => {
        listData = data ?? TRANSACTIONS_LIST;
        await page.navigate();
      });

      test('should display transactions', async ({ page }) => {
        const transactionsNumber = await page.getTransactionsNumber();
        expect(transactionsNumber).toEqual(listData.size);
      });
      test('should filter transactions', async ({ page }) => {
        await page.searchTransactions(listData.searchTerm);
        const transactionsNumber = await page.getTransactionsNumber();
        expect(transactionsNumber).toEqual(listData.size);
      });
    });
  });
}
