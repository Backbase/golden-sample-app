import { Injectable } from '@angular/core';
import { Transaction } from '../model/transaction';
import { of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TransactionsHttpService {
  constructor(private http: HttpClient, private readonly configurationService: TransactionsJourneyConfiguration) {}

  public transactions$ = of(this.configurationService.pageSize).pipe(
    map((pageSize) => new HttpParams().append('page', String(0)).append('pageSize', String(pageSize))),
    switchMap((params) => this.http.get<Transaction[]>('/api/transactions', { params })),
  );
}
