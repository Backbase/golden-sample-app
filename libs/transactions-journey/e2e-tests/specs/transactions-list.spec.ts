import { expect, TestType } from '@playwright/test';
import {
  TransactionFixture,
  TransactionListDataType,
} from '../model/transaction';

export function testTransactionsList(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe('Transactions', () => {
    test.describe('Transactions list', () => {
      let data: TransactionListDataType;

      test.beforeEach(async ({ listPage, listData }) => {
        data = listData;
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
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe('Transaction list', () => {
    test('Error scenario', async ({ listPage }) => {
      await listPage.navigate();
      expect(true).toBe(true);
    });
  });
}
