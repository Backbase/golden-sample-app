import { TestType } from '@playwright/test';
import { TransactionDataType, TransactionFixture } from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>,
  testData: TransactionDataType
) {
  test.describe(
    'Transactions details',
    { tag: ['@e2e', '@transactions', '@transactions-details', '@mocks'] },
    () => {
      test.beforeEach(async ({ transactionMockSetup }) => {
        await transactionMockSetup(testData.transactions);
      });

      for (const transaction of testData.transactions) {
        test(`should display correct transaction details (id: ${transaction.id}; name: ${transaction.recipient})`, async ({
          transactionDetailsPage,
          visual,
        }) => {
          await transactionDetailsPage.open(transaction.id);
          await visual.step(
            `Then validate Transactions details: ${JSON.stringify(
              transaction
            )}`,
            async () => {
              await transactionDetailsPage.details.validateDetails(transaction);
            }
          );
        });
      }
    }
  );
}
