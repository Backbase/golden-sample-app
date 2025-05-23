import { BaseComponent, PageInfo } from '@backbase/e2e-tests';
import { TransactionsItem } from './transaction-item';
import { TransactionDetailsDataType } from '../../model';

export class Transactions extends BaseComponent {
  getByIndex = (index: number) => new TransactionsItem(this.element.nth(index));
  first = () => this.getByIndex(0);
  recipients = this.childByTestId('recipient');

  get items() {
    return this.element;
  }

  async getTransactions(): Promise<Partial<TransactionDetailsDataType>[]> {
    const count = await this.items.count();
    const transactions: Partial<TransactionDetailsDataType>[] = [];

    for (let i = 0; i < count; i++) {
      const transaction = this.getByIndex(i);
      transactions.push(await transaction.getTransaction());
    }
    return transactions;
  }

  constructor(pageObject: PageInfo) {
    super(pageObject.locator('bb-transaction-item'), pageObject);
  }
}
