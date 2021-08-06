import { Injectable } from '@angular/core';
import { Transaction } from './model/transaction';
import * as mocks from './mock-data/transactions.json';

@Injectable({
  providedIn: 'root'
})
export class TransactionsJourneyService {

  getTransactions(page: number, pageSize: number): Transaction[] {
    return mocks.data
      .sort((a: Transaction, b: Transaction) => b.dates.valueDate - a.dates.valueDate)
      .slice(page, pageSize);
  }
}
