import { BaseComponent, formatDate } from '@backbase-gsa/e2e-tests';
import { TransactionDetailsDataType } from '../../model';
import { expect } from '@playwright/test';

export class TransactionsItem extends BaseComponent {
  recipient = this.childByTestId('recipient');
  date = this.childByTestId('date');
  amount = this.childByTestId('amount');
  accountNumber = this.childByTestId('account-number');

  async validateTransaction(transaction: Partial<TransactionDetailsDataType>) {
    if (transaction.recipient) {
      await expect(this.recipient).toHaveText(transaction.recipient);
    }
    if (transaction.date) {
      const date =
        typeof transaction.date === 'string'
          ? transaction.date
          : formatDate(transaction.date, 'Mon D, YYYY');
      await expect(this.date).toHaveText(date);
    }
    if (transaction.amount) {
      const amount =
        typeof transaction.amount === 'string'
          ? transaction.amount
          : transaction.amount.value;
      await expect(this.amount).toHaveText(`$${amount}`);
    }
    if (transaction.accountNumber) {
      await expect(this.accountNumber).toHaveText(transaction.accountNumber);
    }
  }
}
