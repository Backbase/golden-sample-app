import { TestType, expect } from '@playwright/test';
import { TransactionDataType, TransactionFixture } from '../model/transaction';
import { formatDate } from '@backbase-gsa/e2e-tests';
import { getTransactionAmountValue } from '../page-objects/ui-components/transaction-details';

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
              const transactionPage = transactionDetailsPage.details;
              await expect
                .soft(transactionPage.recipient.value)
                .toHaveText(transaction.recipient ?? '');

              const date =
                typeof transaction.date === 'string'
                  ? transaction.date
                  : formatDate(transaction.date, 'Mon D, YYYY');
              await expect
                .soft(transactionPage.date.value)
                .toHaveText(date);

              await expect
                .soft(transactionPage.amount.value)
                .toHaveText(
                  getTransactionAmountValue(transaction.amount ?? '')
                );

              await expect
                .soft(transactionPage.category.value)
                .toHaveText(transaction.category ?? '');

              await expect
                .soft(transactionPage.description.value)
                .toHaveText(transaction.description ?? '');

              await expect
                .soft(transactionPage.status.value)
                .toHaveText(transaction.status ?? '');
            }
          );
        });
      }

      const transaction = testData.transactions[0];
      test(`[validateDetails] should display correct transaction details (id: ${transaction.id}; name: ${transaction.recipient})`, async ({
        transactionDetailsPage,
      }) => {
        await transactionDetailsPage.open(transaction.id);
        await transactionDetailsPage.details.toHaveTransaction(transaction);
      });

      test(`[toHaveData] should display correct transaction details (id: ${transaction.id}; name: ${transaction.recipient})`, async ({
        transactionDetailsPage,
      }) => {
        await transactionDetailsPage.open(transaction.id);
        const transactionPage = transactionDetailsPage.details;
        await transactionPage.toHaveData(
          {
            actual: () => transactionPage.getTransactionDetails(),
            expected: transactionPage.formatTransactionData(transaction),
          },
          {
            stepName: `Then validate Transactions details: ${JSON.stringify(
              transaction
            )}`,
          }
        );
      });
    }
  );
}
