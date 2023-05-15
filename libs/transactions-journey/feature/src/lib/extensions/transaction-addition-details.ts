import { TransactionItem } from '@backbase/transactions-http-ang';
import { ViewExtensionComponent } from '@backbase/ui-ang/view-extensions';

export type TransactionAdditionalDetailsContext = Pick<
  TransactionItem,
  'additions' | 'counterPartyAccountNumber' | 'merchant'
>;
export type TransactionAdditionalDetailsComponent =
  ViewExtensionComponent<TransactionAdditionalDetailsContext>;
