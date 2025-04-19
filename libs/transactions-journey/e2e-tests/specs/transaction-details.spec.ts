import { TestType } from '@playwright/test';
import { TransactionDataType, TransactionFixture } from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>,
  testData: TransactionDataType
) {
  test.describe(
    'Transactions details',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(async ({ transactionDetailsPage }) => {
        await transactionDetailsPage.open(testData.transactionDetails.id);
      });

      test('should display correct transaction details', async ({
        transactionDetailsPage,
        visual,
      }) => {
        await visual.step(
          `Then validate Transactions details: ${JSON.stringify(
            testData.transactionDetails
          )}`,
          async () => {
            await transactionDetailsPage.details.validateDetails(
              testData.transactionDetails
            );
          }
        );
      });
    }
  );
}
