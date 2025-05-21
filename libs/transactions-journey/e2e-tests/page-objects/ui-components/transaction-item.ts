import {
  BaseComponent,
  formatDate,
  getTrimmedText,
} from '@backbase-gsa/e2e-tests';
import { getAmountValue, TransactionDetailsDataType } from '../../model';
import { expect } from '@playwright/test';

export class TransactionsItem extends BaseComponent {
  recipient = this.childByTestId('recipient');
  date = this.childByTestId('date');
  amount = this.childByTestId('amount');
  accountNumber = this.childByTestId('account-number');

  async validateTransaction(transaction: Partial<TransactionDetailsDataType>) {
    if (transaction.recipient) {
      await expect.soft(this.recipient).toHaveText(transaction.recipient);
    }
    if (transaction.date) {
      const date =
        typeof transaction.date === 'string'
          ? transaction.date
          : formatDate(transaction.date, 'Mon D, YYYY');
      await expect.soft(this.date).toHaveText(date);
    }
    if (transaction.amount) {
      await expect
        .soft(this.amount)
        .toHaveText(`$${getAmountValue(transaction.amount)}`);
    }
    if (transaction.accountNumber) {
      await expect
        .soft(this.accountNumber)
        .toHaveText(transaction.accountNumber);
    }
  }

  async getTransaction(): Promise<Partial<TransactionDetailsDataType>> {
    return {
      recipient: await getTrimmedText(this.recipient),
      date: await getTrimmedText(this.date),
      amount: (await getTrimmedText(this.amount)).replace('$', ''),
      accountNumber: await getTrimmedText(this.accountNumber),
    };
  }
}
