import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
} from '@angular/router';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { Observable, of } from 'rxjs';

@Injectable()
export class TransactionsDetailsRouteResolverService implements Resolve<TransactionItem | null> {
  resolve() : Observable<TransactionItem> | Observable<null>{
    const transactionData = this.router.getCurrentNavigation()?.extras?.state as TransactionItem;
    if (!transactionData) {
      return of(null);
    }
    else return of(transactionData);
  }
  constructor(private router: Router) {}

}
