import { BasePage } from '@backbase-gsa/e2e-tests';
import { Transactions } from '../ui-components';

export class TransactionsPage extends BasePage {
  search = this.locator('bb-input-text-ui input');
  transactions = new Transactions(this);
}
