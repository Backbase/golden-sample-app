import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '../../communication';
import { TransactionsHttpService } from '../../services/transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
  selector: 'bb-transactions-view',
})
export class TransactionsViewComponent {
  public title = this.route.snapshot.data['title'];
  public filter = '';
  public bankAlias$ = this.route.queryParams;
  public transactions$ = combineLatest([
    this.transactionsService.transactions$,
    this.externalCommunicationService?.latestTransaction$ || of(undefined),
    this.route.queryParams,
  ]).pipe(
    map(([transactions, latestTransaction, routeParameters]) => {
      const transactionsList = latestTransaction
        ? [latestTransaction, ...(transactions || [])]
        : transactions;
      if (routeParameters['id']) {
        return transactionsList?.filter(
          (item) => item.arrangementId === routeParameters['id']
        );
      } else return transactionsList;
    })
  );

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private readonly transactionsService: TransactionsHttpService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService,
  ) {}

  search(ev: string){
    this.filter = ev || '';
    this.router?.navigate([], {queryParams: {search: this.filter}});
  }
}
