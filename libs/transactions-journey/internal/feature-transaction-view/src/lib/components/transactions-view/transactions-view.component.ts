import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BadgeModule } from '@backbase/ui-ang/badge';
import { AmountModule } from '@backbase/ui-ang/amount';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import {
  ScreenViewTrackerEventPayload,
  Tracker,
  TrackerModule,
  TrackNavigationDirective,
} from '@backbase/foundation-ang/observability';

import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  ArrangementsService,
  TransactionsHttpService,
} from '@backbase-gsa/transactions-journey/internal/data-access';

import { TransactionListTrackerEvent } from '@backbase-gsa/transactions-journey/internal/shared-data';
import { TextFilterComponent } from '@backbase-gsa/transactions-journey/internal/ui';
import { FilterTransactionsPipe } from '@backbase-gsa/transactions-journey/internal/util';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  selector: 'bb-transactions-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingIndicatorModule,
    BadgeModule,
    AmountModule,
    TrackerModule,
    FilterTransactionsPipe,
    TextFilterComponent,
    TransactionItemComponent,
    AsyncPipe,
    NgIf,
    NgForOf,
  ],
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transactionsService: TransactionsHttpService,
    private readonly arrangementsService: ArrangementsService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService,
    @Optional() private tracker?: Tracker
  ) {}

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
