import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ScreenViewTrackerEventPayload,
  Tracker,
} from '@backbase/foundation-ang/observability';

import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERVICE,
  ArrangementsService,
  TransactionsHttpService,
} from '@backbase-gsa/transactions-journey/internal/data-access';

import { TransactionListTrackerEvent } from '@backbase-gsa/transactions-journey/internal/shared-data';
import {
  TRANSACTIONS_JOURNEY_TRANSACTION_VIEW_TRANSLATIONS,
  transactionsJourneyTransactionViewTranslations,
  TransactionsJourneyTransactionViewTranslations,
} from '../../../translations-catalog';

@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  selector: 'bb-transactions-view',
  standalone: false,
})
export class TransactionsViewComponent {
  public title = this.route.snapshot.data['title'];

  public filter = '';

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

  private readonly defaultTranslations: TransactionsJourneyTransactionViewTranslations =
    transactionsJourneyTransactionViewTranslations;
  public readonly translations: TransactionsJourneyTransactionViewTranslations;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transactionsService: TransactionsHttpService,
    private readonly arrangementsService: ArrangementsService,
    @Inject(TRANSACTIONS_JOURNEY_TRANSACTION_VIEW_TRANSLATIONS)
    private readonly overridingTranslations: Partial<TransactionsJourneyTransactionViewTranslations> = {},
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERVICE)
    private readonly externalCommunicationService: TransactionsCommunicationService,
    @Optional() private readonly tracker?: Tracker
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations).map(([key, value]) => [
          key,
          value ?? this.defaultTranslations[key],
        ])
      ),
    };
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
