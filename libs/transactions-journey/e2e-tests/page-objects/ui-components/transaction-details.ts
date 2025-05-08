import { BaseComponent, PageInfo, formatDate } from '@backbase-gsa/e2e-tests';
import { Amount, TransactionDetailsDataType } from '../../model';
import { LabeledData } from './labeled-data';
import { test, expect } from '@playwright/test';

const getAmount = (value?: string | Amount | number): string =>
  typeof value === 'object' ? value.value : value?.toString() ?? '0';
const getCurrencySymbol = (value?: string | Amount | number): string =>
  typeof value === 'object' && value.currency?.toUpperCase() === 'EUR'
    ? '€'
    : '$';
export const getTransactionAmountValue = (
  value?: string | Amount | number
): string => getCurrencySymbol(value) + getAmount(value);
export const getTransactionDate = (value: Date | string | undefined): string =>
  typeof value === 'string' ? value : formatDate(value, 'Mon D, YYYY');

export const getTransactionDetails = async (
  transactionDetails: TransactionDetails
): Promise<Partial<TransactionDetailsDataType>> => ({
  recipient: await transactionDetails.recipient.getText(),
  date: await transactionDetails.date.getText(),
  amount: await transactionDetails.amount.getText(),
  category: await transactionDetails.category.getText(),
  description: await transactionDetails.description.getText(),
  status: await transactionDetails.status.getText(),
});

export class TransactionDetails extends BaseComponent {
  recipient = new LabeledData(this.childByTestId('recipient'));
  date = new LabeledData(this.childByTestId('date'));
  amount = new LabeledData(this.childByTestId('amount'));
  category = new LabeledData(this.childByTestId('category'));
  description = new LabeledData(this.childByTestId('description'));
  status = new LabeledData(this.childByTestId('status'));

  constructor(pageObject: PageInfo) {
    super(pageObject.page.locator('bb-transaction-details'), pageObject);
  }

  async toHaveTransaction(transaction: Partial<TransactionDetailsDataType>) {
    await test.step(`Then validate Transactions details: ${JSON.stringify(
      transaction
    )}`, async () => {
      await expect
        .soft(this.recipient.value)
        .toHaveText(transaction.recipient ?? '');
      await expect
        .soft(this.date.value)
        .toHaveText(getTransactionDate(transaction.date));

      await expect
        .soft(this.amount.value)
        .toHaveText(getTransactionAmountValue(transaction.amount));

      await expect
        .soft(this.category.value)
        .toHaveText(transaction.category ?? '');

      await expect
        .soft(this.description.value)
        .toHaveText(transaction.description ?? '');
      await expect.soft(this.status.value).toHaveText(transaction.status ?? '');
    });
  }

  async getTransactionDetails(): Promise<Partial<TransactionDetailsDataType>> {
    return {
      recipient: await this.recipient.getText(),
      date: await this.date.getText(),
      amount: await this.amount.getText(),
      category: await this.category.getText(),
      description: await this.description.getText(),
      status: await this.status.getText(),
    };
  }

  formatTransactionData(
    transaction: Partial<TransactionDetailsDataType>
  ): Partial<TransactionDetailsDataType> {
    return {
      ...transaction,
      id: undefined,
      amount: getTransactionAmountValue(transaction.amount ?? ''),
      date: getTransactionDate(transaction.date ?? ''),
    };
  }
}
