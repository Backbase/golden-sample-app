import { expect, TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionsList(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe('Transactions list',
    { tag: ['@e2e', '@transactions', '@transactions-details'] }, () => {

    test.beforeEach(async ({ transactionsPage }) => {
      await transactionsPage.open();
    });

    test('should display transactions', async ({ transactionsPage, transactionsListData, visual }) => {
      await visual.step('Then validate Transactions list', async () => {
        await expect(transactionsPage.transactions.items)
          .toHaveCount(transactionsListData.size);
      });
    });

    test('should filter transactions', async ({ transactionsPage, transactionsListData, visual }) => {
      for (const expectation of transactionsListData.searchExpectations) {
        await test.step(`Search transactions by "${expectation.term}" term`, async () => {
          await transactionsPage.search.fill(expectation.term);
        });
        await visual.step(`Validate transactions in list`, async () => {
          await expect(transactionsPage.transactions.items)
            .toHaveCount(expectation.count);
          if (expectation.firstTransaction) {
            await transactionsPage.transactions.getByIndex(0)
              .validateTransaction(expectation.firstTransaction);
          }
        });
      }
    });
  });
}
