import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account } from '../model/Account';

@Injectable()
export class MakeTransferAccountHttpService {
  currentAccount$: Observable<Account> = of({
    id: '00001',
    name: 'my account name',
    amount: 5690.76,
  })

  constructor(private http: HttpClient) {}
}
