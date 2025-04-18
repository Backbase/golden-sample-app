import { BasePage } from '@backbase-gsa/e2e-tests';
import { TransactionDetails } from '../ui-components';

export class TransactionDetailsPage extends BasePage {
  details = new TransactionDetails(this);
}
