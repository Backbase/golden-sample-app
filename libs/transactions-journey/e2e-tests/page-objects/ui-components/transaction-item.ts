import { BaseComponent, formatDate } from '@backbase-gsa/e2e-tests';
import { getAmountValue, TransactionDetailsDataType } from '../../model';
import { expect } from '@playwright/test';

export class TransactionsItem extends BaseComponent {
  recipient = this.childByTestId('recipient');
  date = this.childByTestId('date');
  amount = this.childByTestId('amount');
  accountNumber = this.childByTestId('account-number');

  private async getTrimmedText(element: any): Promise<string> {
    return (await element.textContent())?.trim() ?? '';
  }

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
    const amount = await this.getTrimmedText(this.amount);
    return {
      recipient: await this.getTrimmedText(this.recipient),
      date: await this.getTrimmedText(this.date),
      amount: amount.replace('$', ''),
      accountNumber: await this.getTrimmedText(this.accountNumber),
    };
  }
}
