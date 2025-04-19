import { BaseComponent, PageInfo } from '@backbase-gsa/e2e-tests';
import { TransactionsItem } from './transaction-item';

export class Transactions extends BaseComponent {
  getByIndex = (index: number) => new TransactionsItem(this.root.nth(index));
  getFirst = () => this.getByIndex(0);

  get items() {
    return this.root;
  }

  constructor(pageObject: PageInfo) {
    super(pageObject.locator('bb-transaction-item'), pageObject);
  }
}
