import { Component, Inject, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ScreenViewTrackerEventPayload,
  Tracker,
} from '@backbase/foundation-ang/observability';

import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  ArrangementsService,
  TransactionsHttpService,
} from '@backbase-gsa/transactions-journey/internal/data-access';

import { TransactionListTrackerEvent } from '@backbase-gsa/transactions-journey/internal/shared-data';
import {
  transactionsJourneyTransactionViewTranslations,
  TransactionsJourneyTransactionViewTranslations,
} from '../../../translations-catalog';

@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  selector: 'bb-transactions-view',
})
export class TransactionsViewComponent {
  public title = this.route.snapshot.data['title'];

  public filter = '';

  @Input() public translations: TransactionsJourneyTransactionViewTranslations =
    transactionsJourneyTransactionViewTranslations;

  private readonly accountId$ = this.route.queryParamMap.pipe(
    map((params) => params.get('account'))
  );

  public accountName$ = combineLatest({
    accountId: this.accountId$,
    accounts: this.arrangementsService.arrangements$,
  }).pipe(
    map(({ accountId, accounts }) => accounts.find((x) => x.id === accountId)),
    map((account) => account?.bankAlias ?? '')
  );

  public transactions$ = combineLatest({
    transactions: this.transactionsService.transactions$,
    transfer:
      this.externalCommunicationService?.latestTransaction$ ?? of(undefined),
    accountId: this.accountId$,
  }).pipe(
    map(({ transactions = [], transfer, accountId }) => {
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

  public searchQuery$ = this.route.queryParamMap.pipe(
    map((params) => params.get('search') ?? '')
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transactionsService: TransactionsHttpService,
    private readonly arrangementsService: ArrangementsService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService,
    @Optional() private tracker?: Tracker
  ) {
    this.route.data.subscribe((data) => {
      if (data['translation']) {
        this.translations = data['translation'];
      }
    });
  }

  search(ev: string) {
    this.filter = ev || '';
    this.router.navigate([], {
      queryParams: { search: this.filter || undefined },
      queryParamsHandling: 'merge',
    });
  }

  trackNavigation($event: ScreenViewTrackerEventPayload) {
    this.tracker?.publish(new TransactionListTrackerEvent($event));
  }
}
