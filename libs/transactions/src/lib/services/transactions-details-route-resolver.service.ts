import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { map } from 'rxjs';
import { TransactionsHttpService } from './transactions.http.service';

@Injectable()
export class TransactionsDetailsRouteResolverService
  implements Resolve<TransactionItem | null>
{
  resolve(route: ActivatedRouteSnapshot) {
    const transactionData = this.router.getCurrentNavigation()?.extras
      ?.state as TransactionItem;

    if (transactionData) {
      return transactionData;
    }

    return this.api.transactions$.pipe(
      map(
        (transactions) =>
          transactions?.find((t) => t.id === route.params['id']) ?? null
      )
    );
  }

  constructor(private router: Router, private api: TransactionsHttpService) {}
}
