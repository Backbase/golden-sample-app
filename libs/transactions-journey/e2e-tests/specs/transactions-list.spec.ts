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

      test('should display transactions', async ({ transactionsPage }) => {
        await test.step('Then validate Transactions list', async () => {
          await expect(transactionsPage.transactions.items).toHaveCount(
            testData.transactionList.size
          );
        });
      });

      test('should display transactions recipients', async ({
        transactionsPage,
      }) => {
        await test.step('Then validate Transactions list', async () => {
          await expect(transactionsPage.transactions.recipients).toHaveText(
            testData.recipients
          );
        });
      });

      for (const expectation of testData.transactionList.searchExpectations) {
        test(`should filter by term ${expectation.term}`, async ({
          transactionsPage,
        }) => {
          await test.step(`Search transactions by "${expectation.term}" term`, async () => {
            await transactionsPage.search.fill(expectation.term);
          });
          await test.step(`Validate transactions in list`, async () => {
            await expect(() =>
              transactionsPage.transactions.getTransactions()
            ).toHaveObject(expectation.transactions);
          });
        });
      }

      const expectation = testData.transactionList.searchExpectations[1];
      test(`[contain] should filter by term ${expectation.term}`, async ({
        transactionsPage,
      }) => {
        await test.step(`Search transactions by "${expectation.term}" term`, async () => {
          await transactionsPage.search.fill(expectation.term);
        });
        await test.step(`Validate transactions in list`, async () => {
          await expect(() =>
            transactionsPage.transactions.getTransactions()
          ).toContainObject(expectation.transactions[0]);
        });
      });
    }
  );
}
