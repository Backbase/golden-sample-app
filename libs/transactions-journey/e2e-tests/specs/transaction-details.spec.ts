import { TestType } from '@playwright/test';
import { TransactionDataType, TransactionFixture } from '../model/transaction';
import {
  getTransactionAmountValue,
  getTransactionDate,
} from '../page-objects/ui-components/transaction-details';
import { expect } from '@playwright/test';

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
        test(`[getDetails] should display correct transaction details (id: ${transaction.id}; name: ${transaction.recipient})`, async ({
          transactionDetailsPage,
        }) => {
          await transactionDetailsPage.open(transaction.id);
          const details = transactionDetailsPage.details;
          await expect(() => details.getTransactionDetails()).toHaveObject(
            details.formatTransactionData(transaction)
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

      test(`should display correct transaction details (id: ${transaction.id}; name: ${transaction.recipient})`, async ({
        transactionDetailsPage,
      }) => {
        await transactionDetailsPage.open(transaction.id);
        const transactionDetails = transactionDetailsPage.details;
        await test.step(`Then validate Transactions details: ${JSON.stringify(
          transaction
        )}`, async () => {
          await expect
            .soft(transactionDetails.recipient.value)
            .toHaveText(transaction.recipient ?? '');

          await expect
            .soft(transactionDetails.date.value)
            .toHaveText(getTransactionDate(transaction.date));

          await expect
            .soft(transactionDetails.amount.value)
            .toHaveText(getTransactionAmountValue(transaction.amount));

          await expect
            .soft(transactionDetails.category.value)
            .toHaveText(transaction.category ?? '');

          await expect
            .soft(transactionDetails.description.value)
            .toHaveText(transaction.description ?? '');

          await expect
            .soft(transactionDetails.status.value)
            .toHaveText(transaction.status ?? '');
        });
      });
    }
  );
}
