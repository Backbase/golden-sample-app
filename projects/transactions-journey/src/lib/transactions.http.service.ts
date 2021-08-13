import { Injectable } from '@angular/core';
import { Transaction } from './model/transaction';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsHttpService {
  constructor(private http: HttpClient) {}

  getTransactions(page: number, pageSize: number): Observable<Transaction[]> {
    const params = new HttpParams()
      .append('page', String(page))
      .append('pageSize', String(pageSize));

    return this.http.get<Transaction[]>('/api/transactions', { params });
  }
}
