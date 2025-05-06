import { BaseComponent, PageInfo } from '@backbase-gsa/e2e-tests';
import { TransactionsItem } from './transaction-item';

export class Transactions extends BaseComponent {
  getByIndex = (index: number) => new TransactionsItem(this.element.nth(index));
  first = () => this.getByIndex(0);

  get items() {
    return this.element;
  }

  constructor(pageObject: PageInfo) {
    super(pageObject.locator('bb-transaction-item'), pageObject);
  }
}
