import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionsCommunicationService, TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE } from '../../communication';
import { TransactionsHttpService } from '../../services/transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
})
export class TransactionsViewComponent {
  title = this.route.snapshot.data.title;

  filter = '';

  transactions = combineLatest([
    this.transactionsService.transactions$,
    this.externalCommunicationService?.latestTransaction$ || of(undefined),
  ]).pipe(
    map(([transactions, latestTransaction]) =>
      latestTransaction ? [latestTransaction, ...transactions] : transactions,
    ),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionsService: TransactionsHttpService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService,
  ) {}
}
