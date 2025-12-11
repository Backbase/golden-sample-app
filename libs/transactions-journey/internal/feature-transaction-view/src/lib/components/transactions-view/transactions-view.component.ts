import { Component, inject, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import {
  ScreenViewTrackerEventPayload,
  Tracker,
  TrackerModule,
} from '@backbase/foundation-ang/observability';

import { BadgeModule } from '@backbase/ui-ang/badge';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { AmountModule } from '@backbase/ui-ang/amount';

import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  ArrangementsService,
  TransactionsHttpService,
} from '@backbase/transactions-journey/internal/data-access';

import { TextFilterComponent } from '@backbase/transactions-journey/internal/ui';
import { FilterTransactionsPipe } from '@backbase/transactions-journey/internal/util';
import { TransactionListTrackerEvent } from '@backbase/transactions-journey/internal/shared-data';
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
  ],
})
export class TransactionsViewComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly arrangementsService: ArrangementsService =
    inject(ArrangementsService);
  private readonly transactionsService: TransactionsHttpService = inject(
    TransactionsHttpService
  );
  private readonly externalCommunicationService: TransactionsCommunicationService =
    inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE);

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

  private readonly router: Router = inject(Router);
  private readonly tracker: Tracker | null = inject(Tracker, {
    optional: true,
  });

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
