import { TestType } from '@playwright/test';
import { TransactionFixture } from '../model/transaction';

export function testTransactionDetails(
  test: TestType<TransactionFixture, TransactionFixture>
) {
  test.describe(
    'Transactions details',
    { tag: ['@e2e', '@transactions', '@transactions-details'] },
    () => {
      test.beforeEach(
        async ({ transactionDetailsPage, transactionDetailsData }) => {
          await transactionDetailsPage.open(transactionDetailsData.id);
        }
      );

      test('should display correct transaction details', async ({
        transactionDetailsPage,
        transactionDetailsData,
        visual,
      }) => {
        await visual.step(
          `Then validate Transactions details: ${JSON.stringify(
            transactionDetailsData
          )}`,
          async () => {
            await transactionDetailsPage.details.validateDetails(
              transactionDetailsData
            );
          }
        );
      });
    }
  );
}
