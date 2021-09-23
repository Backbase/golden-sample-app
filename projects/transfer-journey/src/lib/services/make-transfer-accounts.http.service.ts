import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account } from '../model/Account';

@Injectable()
export class MakeTransferAccountHttpService {
  currentAccount$: Observable<Account> = this.http.get<Account>('/api/accounts/current');
  constructor(private http: HttpClient) {}
}
