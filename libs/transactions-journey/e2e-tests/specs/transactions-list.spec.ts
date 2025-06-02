import { TestType } from '@playwright/test';
import { TransactionDataType, TransactionFixture } from '../model/transaction';
import { expect } from '@backbase/e2e-tests';

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
        await expect(
          transactionsPage.transactions.items,
          `Expect "${testData.transactionList.size}" transactions`
        ).toHaveCount(testData.transactionList.size);
      });

      test('should display transactions recipients', async ({
        transactionsPage,
      }) => {
        await expect(
          transactionsPage.transactions.recipients,
          `Expect "${testData.recipients}" recipients`
        ).toHaveText(testData.recipients);
      });

      test('should display transactions recipients subset', async ({
        transactionsPage,
      }) => {
        await expect(
          transactionsPage.transactions.recipients,
          `Expect "${testData.recipientsSubset}" recipients`
        ).toContainObject(testData.recipientsSubset);
      });

      for (const expectation of testData.transactionList.searchExpectations) {
        test(`should filter by term ${expectation.term}`, async ({
          transactionsPage,
        }) => {
          await transactionsPage.search.fill(expectation.term);
          await expect(
            () => transactionsPage.transactions.getTransactions(),
            `Expect "${JSON.stringify(expectation.transactions)}" transactions`
          ).toHaveObject(expectation.transactions);
        });
      }

      const expectation = testData.transactionList.searchExpectations[1];
      test(`[contain] should filter by term ${expectation.term}`, async ({
        transactionsPage,
      }) => {
        await transactionsPage.search.fill(expectation.term);
        await expect(
          () => transactionsPage.transactions.getTransactions(),
          `Expect "${JSON.stringify(expectation.transactions[0])}" transactions`
        ).toContainObject(expectation.transactions[0]);
      });

      test(`should filter by term ${expectation.term} and all results have this term`, async ({
        transactionsPage,
      }) => {
        await transactionsPage.search.fill(expectation.term);
        await expect(
          transactionsPage.transactions.recipients,
          `Expect all results have "${expectation.transactions[0].recipient}"`
        ).listToContainText(expectation.term);
      });
    }
  );
}
