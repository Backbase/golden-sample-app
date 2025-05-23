import { BasePage } from '@backbase/e2e-tests';
import { TransactionDetails } from '../ui-components';

export class TransactionDetailsPage extends BasePage {
  details = new TransactionDetails(this);
}
