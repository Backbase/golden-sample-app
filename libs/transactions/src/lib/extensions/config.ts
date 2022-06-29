import { InjectionToken, Type } from '@angular/core';
import { TransactionAdditionalDetailsComponent } from './transaction-addition-details';

export interface TransactionsJourneyExtensionsConfig {
  transactionItemAdditionalDetails?: Type<TransactionAdditionalDetailsComponent>;
  // other extensions slots here
}

export const TRANSACTION_EXTENSIONS_CONFIG =
  new InjectionToken<TransactionsJourneyExtensionsConfig>(
    'TRANSACTION_EXTENSIONS_CONFIG'
  );
