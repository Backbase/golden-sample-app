import { InjectionToken } from '@angular/core';
import { TransactionItem } from '@backbase/transactions-http-ang';
import { Observable } from 'rxjs';

export interface TransactionsCommunicationService {
  latestTransaction$: Observable<TransactionItem | undefined>;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERVICE =
  new InjectionToken<TransactionsCommunicationService>(
    'bb-transactions-journey communication service'
  );
