import { InjectionToken, Type } from '@angular/core';
import { TransactionAdditionalDetailsComponent } from '@libs/transactions';

export interface TransactionsJourneyExtensionsConfig {
  transactionItemAdditionalDetails?: Type<TransactionAdditionalDetailsComponent>;
  // other extensions slots here
}

export const ΘTRANSACTION_EXTENSIONS_CONFIG =
  new InjectionToken<TransactionsJourneyExtensionsConfig>(
    'TRANSACTION_EXTENSIONS_CONFIG'
  );
