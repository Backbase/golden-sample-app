import { expect, TestType } from '@playwright/test';
import { TransactionDataType, TransactionFixture } from '../model/transaction';

export function testTransactionsList(
  test: TestType<TransactionFixture, TransactionFixture>,
  testData: TransactionDataType
) {
  test.describe(
    'Transactions list',
    { tag: ['@e2e', '@transactions', '@transactions-details', '@mocks'] },
    () => {
      test.beforeEach(async ({ transactionsPage, transactionsMockSetup }) => {
        await transactionsMockSetup(testData.transactionList);
        await transactionsPage.open();
      });

      test('should display transactions', async ({
        transactionsPage,
        visual,
      }) => {
        await visual.step('Then validate Transactions list', async () => {
          await expect(transactionsPage.transactions.items).toHaveCount(
            testData.transactionList.size
          );
        });
      });

      for (const expectation of testData.transactionList.searchExpectations) {
        test(`should filter by term ${expectation.term}`, async ({
          transactionsPage,
          visual,
        }) => {
          await test.step(`Search transactions by "${expectation.term}" term`, async () => {
            await transactionsPage.search.fill(expectation.term);
          });
          await visual.step(`Validate transactions in list`, async () => {
            await expect(transactionsPage.transactions.items).toHaveCount(
              expectation.count
            );
            if (expectation.firstTransaction) {
              await transactionsPage.transactions
                .first()
                .validateTransaction(expectation.firstTransaction);
            }
          });
        });
      }
    }
  );
}
