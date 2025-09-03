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
          const { details } = transactionDetailsPage;
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
        await expect
          .soft(
            transactionDetails.recipient.value,
            `Transaction recipient is ${transaction.recipient}`
          )
          .toHaveText(transaction.recipient ?? '');

        await expect
          .soft(
            transactionDetails.date.value,
            `Transaction date is ${transaction.date}`
          )
          .toHaveText(getTransactionDate(transaction.date));

        await expect
          .soft(
            transactionDetails.amount.value,
            `Transaction amount is ${transaction.amount}`
          )
          .toHaveText(getTransactionAmountValue(transaction.amount));

        await expect
          .soft(
            transactionDetails.category.value,
            `Transaction category is ${transaction.category}`
          )
          .toHaveText(transaction.category ?? '');

        await expect
          .soft(
            transactionDetails.description.value,
            `Transaction description is ${transaction.description}`
          )
          .toHaveText(transaction.description ?? '');

        await expect
          .soft(
            transactionDetails.status.value,
            `Transaction status is ${transaction.status}`
          )
          .toHaveText(transaction.status ?? '');
      });
    }
  );
}
