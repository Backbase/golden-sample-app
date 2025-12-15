import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, of, take } from 'rxjs';
import { map } from 'rxjs/operators';
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

/**
 * Account selector item interface for UI component binding.
 * Maps ProductSummaryItem to a simpler structure for the selector.
 */
export interface AccountSelectorItem {
  id: string;
  name: string;
  number: string;
}

@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  selector: 'bb-transactions-view',
  standalone: false,
  // ADR-000: Use OnPush change detection for performance
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsViewComponent implements OnInit {
  public title = this.route.snapshot.data['title'];

  public filter = '';

  private readonly accountId$ = this.route.queryParamMap.pipe(
    map((params) => params.get('account'))
  );

  /**
   * Accounts mapped for the account selector UI component.
   * ADR-006: Use design system component with proper data mapping.
   */
  public accounts$ = this.arrangementsService.arrangements$.pipe(
    map((accounts) => this.mapAccountsForSelector(accounts))
  );

  /**
   * Currently selected account based on URL query param.
   * Used for binding to the account selector's selected value.
   */
  public selectedAccount$ = combineLatest({
    accountId: this.accountId$,
    accounts: this.arrangementsService.arrangements$,
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

  ngOnInit(): void {
    this.initDefaultAccount();
  }

  /**
   * Handles account selection from the dropdown.
   * Updates the URL with the selected account ID.
   * @param account - The selected account from the selector
   */
  onAccountSelected(account: AccountSelectorItem): void {
    // RULE: Persist selection in URL for deep-linking support
    this.router.navigate([], {
      queryParams: { account: account.id },
      queryParamsHandling: 'merge',
    });
  }

  search(ev: string): void {
    this.filter = ev || '';
    this.router.navigate([], {
      queryParams: { search: this.filter || undefined },
      queryParamsHandling: 'merge',
    });
  }

  trackNavigation($event: ScreenViewTrackerEventPayload): void {
    this.tracker?.publish(new TransactionListTrackerEvent($event));
  }

  /**
   * Maps ProductSummaryItem array to AccountSelectorItem array.
   * RULE: Use BBAN if available, fallback to IBAN (Q2 clarification).
   */
  private mapAccountsForSelector(
    accounts: ProductSummaryItem[]
  ): AccountSelectorItem[] {
    return accounts.map((account) => ({
      id: account.id ?? '',
      name: account.name ?? '',
      // RULE: BBAN preferred, IBAN as fallback (Q2 answer)
      number: account.BBAN || account.IBAN || '',
    }));
  }

  /**
   * Auto-selects the first account if no account is in the URL.
   * RULE: First account is default (Q1 clarification).
   * ADR-000: Use takeUntilDestroyed for subscription cleanup.
   */
  private initDefaultAccount(): void {
    combineLatest({
      accountId: this.accountId$,
      accounts: this.arrangementsService.arrangements$,
    })
      .pipe(
        take(1),
        filter(({ accountId, accounts }) => !accountId && accounts.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ accounts }) => {
        // RULE: Navigate to first account by default (Q1 answer)
        const firstAccount = accounts[0];
        this.router.navigate([], {
          queryParams: { account: firstAccount.id },
          queryParamsHandling: 'merge',
        });
      });
  }
}
