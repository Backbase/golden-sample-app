import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { TransactionItem } from '@backbase/transactions-http-ang';
import { BehaviorSubject, delay, of, firstValueFrom, Observable } from 'rxjs';

/**
 * AccountSelectorItem interface matching @backbase/ui-ang/account-selector format.
 * Defined here for testing S2 until production code is implemented.
 */
interface AccountSelectorItem {
  id: string;
  balance?: number;
  currency?: string;
  name?: string;
  number?: string;
}
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase-gsa/transactions-journey/internal/data-access';
import {
  debitMockTransaction,
  transactionsMock,
} from '@backbase-gsa/transactions-journey/internal/util';
import { FilterTransactionsPipe } from '@backbase-gsa/transactions-journey/internal/util';
import {
  TransactionsHttpService,
  ArrangementsService,
} from '@backbase-gsa/transactions-journey/internal/data-access';
import { TransactionsViewComponent } from './transactions-view.component';
import { By } from '@angular/platform-browser';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';

/**
 * Mock ProductSummaryItem data for testing account selector functionality.
 */
const mockArrangements: ProductSummaryItem[] = [
  {
    id: 'account-1',
    name: 'Checking Account',
    bookedBalance: 1500.5,
    currency: 'USD',
    BBAN: '123456789',
  } as ProductSummaryItem,
  {
    id: 'account-2',
    name: 'Savings Account',
    bookedBalance: 5000.0,
    currency: 'USD',
    IBAN: 'US12345678901234',
  } as ProductSummaryItem,
  {
    id: 'account-3',
    name: 'Business Account',
    bookedBalance: 10000.0,
    currency: 'EUR',
    BBAN: '987654321',
  } as ProductSummaryItem,
];

@Component({
  selector: 'bb-text-filter-component',
  standalone: true,
  template: '',
})
class MockTextFilterComponent {}
describe('TransactionsViewComponent', () => {
  let transactions$$: BehaviorSubject<TransactionItem[] | undefined>;
  let arrangements$$: BehaviorSubject<ProductSummaryItem[]>;
  let mockTransactionsHttpService: Pick<
    TransactionsHttpService,
    'transactions$'
  >;
  let mockArrangementsService: Pick<ArrangementsService, 'arrangements$'>;
  let latestTransactions$$: BehaviorSubject<TransactionItem | undefined>;
  let mockTransactionsCommunicationService:
    | Pick<TransactionsCommunicationService, 'latestTransaction$'>
    | undefined;

  let fixture: ComponentFixture<TransactionsViewComponent>;

  const setup = (
    snapshot: Pick<ActivatedRouteSnapshot, 'data'>,
    delayFlag = false
  ) => {
    transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(
      undefined
    );
    arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>([]);
    mockTransactionsHttpService = {
      transactions$: transactions$$.asObservable(),
    };
    mockArrangementsService = {
      arrangements$: arrangements$$.asObservable(),
    };
    latestTransactions$$ = new BehaviorSubject<TransactionItem | undefined>(
      undefined
    );

    if (delayFlag) {
      mockTransactionsHttpService.transactions$ =
        mockTransactionsHttpService.transactions$.pipe(delay(300));
    }

    mockTransactionsCommunicationService = {
      latestTransaction$: latestTransactions$$.asObservable(),
    };

    TestBed.configureTestingModule({
      declarations: [TransactionsViewComponent],
      imports: [MockTextFilterComponent, FilterTransactionsPipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: snapshot as ActivatedRouteSnapshot,
            queryParams: of({}),
            queryParamMap: of({
              get: jest.fn(() => ''),
            }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        {
          provide: TransactionsHttpService,
          useValue: mockTransactionsHttpService,
        },
        {
          provide: ArrangementsService,
          useValue: mockArrangementsService,
        },
        {
          provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
          useValue: mockTransactionsCommunicationService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TransactionsViewComponent);
    fixture.detectChanges();
  };

  /**
   * Setup helper with configurable query params for testing URL-based account selection.
   */
  const setupWithQueryParams = (
    snapshot: Pick<ActivatedRouteSnapshot, 'data'>,
    queryParams: Record<string, string>
  ) => {
    transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(
      undefined
    );
    arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>([]);
    mockTransactionsHttpService = {
      transactions$: transactions$$.asObservable(),
    };
    mockArrangementsService = {
      arrangements$: arrangements$$.asObservable(),
    };
    latestTransactions$$ = new BehaviorSubject<TransactionItem | undefined>(
      undefined
    );
    mockTransactionsCommunicationService = {
      latestTransaction$: latestTransactions$$.asObservable(),
    };

    TestBed.configureTestingModule({
      declarations: [TransactionsViewComponent],
      imports: [MockTextFilterComponent, FilterTransactionsPipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: snapshot as ActivatedRouteSnapshot,
            queryParams: of(queryParams),
            queryParamMap: of({
              get: jest.fn((key: string) => queryParams[key] ?? null),
            }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        {
          provide: TransactionsHttpService,
          useValue: mockTransactionsHttpService,
        },
        {
          provide: ArrangementsService,
          useValue: mockArrangementsService,
        },
        {
          provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
          useValue: mockTransactionsCommunicationService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TransactionsViewComponent);
    fixture.detectChanges();
  };

  const elements = {
    getTitle: () =>
      fixture.nativeElement.querySelector(
        '[data-role="transactions-view__title"]'
      ),
    getLoadingState: () =>
      fixture.nativeElement.querySelector(
        '[data-role="transactions-view__loading-state-container"]'
      ),
    getTransactionItems: () =>
      fixture.nativeElement.querySelectorAll(
        '[data-role="transactions-view__item-container"]'
      ),
  };

  describe('transaction', () => {
    const snapshot = {
      data: {
        title: 'someTitle',
      },
    };

    describe('when the server takes long to respond', () => {
      beforeEach(() => {
        setup(snapshot, true);
        transactions$$.next(transactionsMock);
        fixture.detectChanges();
      });

      it('should render loading state if transactions are pending', () => {
        const loadingState = elements.getLoadingState();
        expect(loadingState).not.toBeNull();
      });
    });

    describe('when the server response correctly', () => {
      beforeEach(() => {
        setup(snapshot);
        transactions$$.next(transactionsMock);
        fixture.detectChanges();
      });

      it('should set title from the route data', () => {
        const title = elements.getTitle();
        expect(title.innerHTML.trim()).toBe(snapshot.data['title']);
      });

      it('should render proper amount of transaction items', () => {
        const transactionItems = elements.getTransactionItems();
        expect(transactionItems.length).toBe(transactionsMock.length);
      });

      it('should render additional transaction received from communication service', () => {
        latestTransactions$$.next(debitMockTransaction);
        fixture.detectChanges();

        const transactionItems = elements.getTransactionItems();
        expect(transactionItems.length).toBe(transactionsMock.length + 1);
      });

      it('should render transactions without error if communication service was not provided', () => {
        mockTransactionsCommunicationService = undefined;
        fixture.detectChanges();

        const transactionItems = elements.getTransactionItems();
        expect(transactionItems.length).toBe(transactionsMock.length);
      });
    });
  });

  describe('when there is no title specified', () => {
    it('should not create the title element in the dom', () => {
      const snapshot = {
        data: {
          title: '',
        },
      };

      setup(snapshot);

      expect(fixture.debugElement.query(By.css('h1'))).toBeFalsy();
    });
  });

  describe('accounts$ observable (S2)', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    /**
     * Helper to access accounts$ observable.
     * Uses type assertion since property is being added in S2.
     */
    const getAccounts$ = () =>
      (fixture.componentInstance as unknown as { accounts$: Observable<AccountSelectorItem[]> }).accounts$;

    // Happy path: accounts$ emits mapped arrangement data
    it('should_emit_mapped_accounts_when_arrangements_are_loaded', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts).toHaveLength(3);
    });

    // Happy path: accounts$ maps id correctly
    it('should_map_account_id_when_arrangements_are_loaded', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts[0].id).toBe('account-1');
    });

    // Happy path: accounts$ maps name correctly
    it('should_map_account_name_when_arrangements_are_loaded', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts[0].name).toBe('Checking Account');
    });

    // Happy path: accounts$ maps balance correctly
    it('should_map_account_balance_when_arrangements_are_loaded', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts[0].balance).toBe(1500.5);
    });

    // Happy path: accounts$ maps currency correctly
    it('should_map_account_currency_when_arrangements_are_loaded', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts[0].currency).toBe('USD');
    });

    // Happy path: accounts$ maps number from BBAN
    it('should_map_account_number_from_BBAN_when_BBAN_exists', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts[0].number).toBe('123456789');
    });

    // Edge case: accounts$ maps number from IBAN when no BBAN
    it('should_map_account_number_from_IBAN_when_BBAN_is_missing', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockArrangements);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts[1].number).toBe('US12345678901234');
    });

    // Edge case: accounts$ handles empty arrangements
    it('should_emit_empty_array_when_no_arrangements_exist', async () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next([]);

      // Act
      const accounts = await firstValueFrom(getAccounts$());

      // Assert
      expect(accounts).toHaveLength(0);
    });
  });

  describe('selectedAccount$ observable (S2)', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    /**
     * Helper to access selectedAccount$ observable.
     * Uses type assertion since property is being added in S2.
     */
    const getSelectedAccount$ = () =>
      (fixture.componentInstance as unknown as { selectedAccount$: Observable<AccountSelectorItem | undefined> }).selectedAccount$;

    // Happy path: selectedAccount$ emits correct account when URL has account param
    it('should_emit_selected_account_when_account_id_in_URL', async () => {
      // Arrange
      setupWithQueryParams(snapshot, { account: 'account-2' });
      arrangements$$.next(mockArrangements);

      // Act
      const selectedAccount = await firstValueFrom(getSelectedAccount$());

      // Assert
      expect(selectedAccount?.id).toBe('account-2');
    });

    // Happy path: selectedAccount$ emits account with correct name
    it('should_emit_account_with_correct_name_when_account_id_matches', async () => {
      // Arrange
      setupWithQueryParams(snapshot, { account: 'account-2' });
      arrangements$$.next(mockArrangements);

      // Act
      const selectedAccount = await firstValueFrom(getSelectedAccount$());

      // Assert
      expect(selectedAccount?.name).toBe('Savings Account');
    });

    // Edge case: selectedAccount$ emits undefined when no account in URL
    it('should_emit_undefined_when_no_account_id_in_URL', async () => {
      // Arrange
      setupWithQueryParams(snapshot, {});
      arrangements$$.next(mockArrangements);

      // Act
      const selectedAccount = await firstValueFrom(getSelectedAccount$());

      // Assert
      expect(selectedAccount).toBeUndefined();
    });

    // Error case: selectedAccount$ emits undefined when account ID not found
    it('should_emit_undefined_when_account_id_not_found', async () => {
      // Arrange
      setupWithQueryParams(snapshot, { account: 'non-existent-account' });
      arrangements$$.next(mockArrangements);

      // Act
      const selectedAccount = await firstValueFrom(getSelectedAccount$());

      // Assert
      expect(selectedAccount).toBeUndefined();
    });
  });

  describe('Default account selection (S3)', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    let mockRouter: { navigate: jest.Mock };

    /**
     * Setup helper that captures Router mock for verification.
     */
    const setupForDefaultSelection = (queryParams: Record<string, string>) => {
      transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(
        undefined
      );
      arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>([]);
      mockTransactionsHttpService = {
        transactions$: transactions$$.asObservable(),
      };
      mockArrangementsService = {
        arrangements$: arrangements$$.asObservable(),
      };
      latestTransactions$$ = new BehaviorSubject<TransactionItem | undefined>(
        undefined
      );
      mockTransactionsCommunicationService = {
        latestTransaction$: latestTransactions$$.asObservable(),
      };

      mockRouter = {
        navigate: jest.fn(),
      };

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: snapshot,
              queryParams: of(queryParams),
              queryParamMap: of({
                get: jest.fn((key: string) => queryParams[key] ?? null),
              }),
            },
          },
          {
            provide: Router,
            useValue: mockRouter,
          },
          {
            provide: TransactionsHttpService,
            useValue: mockTransactionsHttpService,
          },
          {
            provide: ArrangementsService,
            useValue: mockArrangementsService,
          },
          {
            provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
            useValue: mockTransactionsCommunicationService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      fixture = TestBed.createComponent(TransactionsViewComponent);
      fixture.detectChanges();
    };

    // Happy path: First account selected when no account in URL
    it('should_navigate_to_first_account_when_no_account_param_in_URL', () => {
      // Arrange
      setupForDefaultSelection({});
      arrangements$$.next(mockArrangements);
      fixture.detectChanges();

      // Act - component initialization triggers default selection

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'account-1' },
        queryParamsHandling: 'merge',
      });
    });

    // Happy path: URL account is respected when present
    it('should_not_navigate_when_account_param_already_in_URL', () => {
      // Arrange
      setupForDefaultSelection({ account: 'account-2' });
      arrangements$$.next(mockArrangements);
      fixture.detectChanges();

      // Act - component initialization should NOT override existing selection

      // Assert
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    // Edge case: No navigation when accounts list is empty
    it('should_not_navigate_when_no_accounts_available', () => {
      // Arrange
      setupForDefaultSelection({});
      arrangements$$.next([]);
      fixture.detectChanges();

      // Act - component initialization with empty accounts

      // Assert
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    // Edge case: Account in URL doesn't exist - should fallback to first account
    it('should_navigate_to_first_account_when_URL_account_not_found', () => {
      // Arrange
      setupForDefaultSelection({ account: 'non-existent-account' });
      arrangements$$.next(mockArrangements);
      fixture.detectChanges();

      // Act - component should detect invalid account and fallback

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'account-1' },
        queryParamsHandling: 'merge',
      });
    });

    // Happy path: Default selection uses first account ID from accounts list
    it('should_select_first_account_id_from_accounts_list_when_defaulting', () => {
      // Arrange
      const customArrangements: ProductSummaryItem[] = [
        {
          id: 'custom-first-account',
          name: 'Custom First',
          bookedBalance: 100,
          currency: 'EUR',
        } as ProductSummaryItem,
        {
          id: 'custom-second-account',
          name: 'Custom Second',
          bookedBalance: 200,
          currency: 'EUR',
        } as ProductSummaryItem,
      ];
      setupForDefaultSelection({});
      arrangements$$.next(customArrangements);
      fixture.detectChanges();

      // Act - component initialization

      // Assert - should use the first account's ID
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'custom-first-account' },
        queryParamsHandling: 'merge',
      });
    });
  });
});
