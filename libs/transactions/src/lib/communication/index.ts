import { InjectionToken } from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { Observable } from 'rxjs';

export interface TransactionsCommunicationService {
  latestTransaction$: Observable<TransactionItem | undefined>;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE =
  new InjectionToken<TransactionsCommunicationService>(
    'bb-transactions-journey communication service'
  );
