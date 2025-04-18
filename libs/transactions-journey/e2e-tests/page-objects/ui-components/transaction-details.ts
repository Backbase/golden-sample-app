import { BaseComponent, PageInfo, LabeledData, formatDate } from '@backbase-gsa/e2e-tests';
import { TransactionDetailsDataType } from '../../model';
import { expect } from '@playwright/test';


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

  async validateDetails(transaction: Partial<TransactionDetailsDataType>) {
    if (transaction.recipient) {
      await expect(this.recipient.value).toHaveText(transaction.recipient);
    }
    if (transaction.date) {
      const date = typeof transaction.date === 'string'
        ? transaction.date 
        : formatDate(transaction.date, 'Mon D, YYYY');
      await expect(this.date.value).toHaveText(date);
    }
    if (transaction.amount) {
      const amount = typeof transaction.amount === 'string' 
        ? transaction.amount 
        : transaction.amount.value;
      await expect(this.amount.value).toHaveText(`$${amount}`);
    }
    if (transaction.category) {
      await expect(this.category.value).toHaveText(transaction.category);
    }
    if (transaction.description) {
      await expect(this.description.value).toHaveText(transaction.description);
    }
    if (transaction.status) {
      await expect(this.status.value).toHaveText(transaction.status);
    }
  }
}
