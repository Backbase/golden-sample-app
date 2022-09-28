import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '../../communication';
import { ArrangementsService } from '../../services/arrangements.service';
import { TransactionsHttpService } from '../../services/transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  selector: 'bb-transactions-view',
})
export class TransactionsViewComponent {
  public title = this.route.snapshot.data['title'];

  public filter = '';

  public accountName$ = combineLatest({
    query: this.route.queryParams,
    accounts: this.arrangementsService.arrangements$,
  }).pipe(
    map(({ query, accounts }) =>
      accounts.find((x) => x.id === query['account'])
    ),
    map((account) => account?.bankAlias ?? '')
  );

  public transactions$ = combineLatest({
    transactions: this.transactionsService.transactions$,
    transfer:
      this.externalCommunicationService?.latestTransaction$ ?? of(undefined),
    query: this.route.queryParams,
  }).pipe(
    map(({ transactions = [], transfer, query: { account: accountId } }) => {
      transactions = [...transactions];

      if (transfer) {
        transactions.unshift(transfer);
      }

      if (accountId) {
        transactions = transactions.filter(
          (item) => item.arrangementId === accountId
        );
      }

      return transactions;
    })
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transactionsService: TransactionsHttpService,
    private readonly arrangementsService: ArrangementsService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService
  ) {}

  search(ev: string) {
    this.filter = ev || '';
    this.router.navigate([], {
      queryParams: { search: this.filter },
      queryParamsHandling: 'merge',
    });
  }
}
