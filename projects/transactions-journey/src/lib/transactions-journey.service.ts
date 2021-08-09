import { Injectable } from '@angular/core';
import { Transaction } from './model/transaction';
import * as mocks from './mock-data/transactions.json';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsJourneyService {

  getTransactions(page: number, pageSize: number): Observable<Transaction[]> {
    return of(mocks.data
      .sort((a: Transaction, b: Transaction) => b.dates.valueDate - a.dates.valueDate)
      .slice(page, pageSize));
  }
}
