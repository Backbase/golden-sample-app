import { Component, DestroyRef, Inject, OnInit, Optional } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';

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
@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  selector: 'bb-transactions-view',
  standalone: false,
})
export class TransactionsViewComponent implements OnInit {
  public title = this.route.snapshot.data['title'];

  public filter = '';

  /** All accounts available for selection from arrangements service */
  public accounts$ = this.arrangementsService.arrangements$;

  private readonly accountId$ = this.route.queryParamMap.pipe(
    map((params) => params.get('account'))
  );

  /** Currently selected account derived from URL query param */
  public selectedAccount$ = combineLatest({
    accountId: this.accountId$,
    accounts: this.accounts$,
  }).pipe(
    map(({ accountId, accounts }) =>
      accounts.find((account) => account.id === accountId)
    )
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
    private readonly destroyRef: DestroyRef,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService,
    @Optional() private tracker?: Tracker
  ) {}

  /**
   * ADR-000: Initialization with proper subscription cleanup.
   * Auto-selects first account if no account is specified in URL.
   */
  ngOnInit(): void {
    combineLatest({
      accountId: this.accountId$,
      accounts: this.accounts$,
    })
      .pipe(
        take(1), // RULE: Only check on initial load
        filter(({ accountId, accounts }) => !accountId && accounts.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ accounts }) => {
        // RULE: Auto-select first account when no account param in URL
        this.onAccountSelect(accounts[0]);
      });
  }

  search(ev: string) {
    this.filter = ev || '';
    this.router.navigate([], {
      queryParams: { search: this.filter || undefined },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Handles account selection from dropdown.
   * Updates URL query param to persist selection.
   * @param account The selected account from account selector
   */
  onAccountSelect(account: ProductSummaryItem): void {
    this.router.navigate([], {
      queryParams: { account: account.id },
      queryParamsHandling: 'merge',
    });
  }

  trackNavigation($event: ScreenViewTrackerEventPayload) {
    this.tracker?.publish(new TransactionListTrackerEvent($event));
  }
}
