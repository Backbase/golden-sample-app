import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction';

export interface TransactionsCommunicationService {
  latestTransaction$: Observable<Transaction | undefined>;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE = new InjectionToken<TransactionsCommunicationService>(
  'bb-transactions-journey communication service',
);
