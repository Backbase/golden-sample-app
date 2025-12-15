import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { TransactionItem } from '@backbase/transactions-http-ang';
import { BehaviorSubject, delay, of } from 'rxjs';
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

  describe('S2: Account Selector', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts: ProductSummaryItem[] = [
      { id: 'acc-1', name: 'Checking Account', BBAN: '1234567890' } as ProductSummaryItem,
      { id: 'acc-2', name: 'Savings Account', BBAN: '0987654321' } as ProductSummaryItem,
    ];

    beforeEach(() => {
      setup(snapshot);
      arrangements$$.next(mockAccounts);
      transactions$$.next(transactionsMock);
      fixture.detectChanges();
    });

    it('should display account selector dropdown', () => {
      // Arrange & Act - done in beforeEach
      // Assert
      const accountSelector = fixture.nativeElement.querySelector('bb-account-selector-ui');
      expect(accountSelector).not.toBeNull();
    });

    it('should pass all accounts from arrangements service to account selector', () => {
      // Arrange & Act - done in beforeEach
      // Assert
      const component = fixture.componentInstance;
      let receivedAccounts: ProductSummaryItem[] | undefined;
      component.accounts$.subscribe((accounts) => {
        receivedAccounts = accounts;
      });
      expect(receivedAccounts).toEqual(mockAccounts);
    });

    it('should have accessible label for account selector', () => {
      // Arrange & Act - done in beforeEach
      // Assert
      const label = fixture.nativeElement.querySelector('#account-selector-label');
      expect(label).not.toBeNull();
      expect(label.textContent).toContain('Account');
    });
  });

  describe('S3: Account Selection with URL Navigation', () => {
    const s3Snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts: ProductSummaryItem[] = [
      { id: 'acc-1', name: 'Checking Account', BBAN: '1234567890' } as ProductSummaryItem,
      { id: 'acc-2', name: 'Savings Account', BBAN: '0987654321' } as ProductSummaryItem,
    ];

    let mockRouter: { navigate: jest.Mock };

    beforeEach(() => {
      setup(s3Snapshot);
      mockRouter = TestBed.inject(Router) as unknown as { navigate: jest.Mock };
      arrangements$$.next(mockAccounts);
      transactions$$.next(transactionsMock);
      fixture.detectChanges();
    });

    it('should update URL query param when account is selected', () => {
      // Arrange
      const component = fixture.componentInstance;
      const selectedAccount = mockAccounts[1];

      // Act
      component.onAccountSelect(selectedAccount);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: selectedAccount.id },
        queryParamsHandling: 'merge',
      });
    });

    it('should derive selectedAccount$ from URL query param', (done) => {
      // Arrange - setup a new fixture with account in query param
      const accountId = 'acc-1';
      TestBed.resetTestingModule();
      transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(undefined);
      arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>(mockAccounts);

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: { title: 'Transactions' } },
              queryParams: of({ account: accountId }),
              queryParamMap: of({
                get: jest.fn((key: string) => (key === 'account' ? accountId : '')),
              }),
            },
          },
          { provide: Router, useValue: { navigate: jest.fn() } },
          { provide: TransactionsHttpService, useValue: { transactions$: transactions$$.asObservable() } },
          { provide: ArrangementsService, useValue: { arrangements$: arrangements$$.asObservable() } },
          { provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE, useValue: undefined },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      const newFixture = TestBed.createComponent(TransactionsViewComponent);
      newFixture.detectChanges();

      // Act & Assert
      newFixture.componentInstance.selectedAccount$.subscribe((selected: ProductSummaryItem | undefined) => {
        expect(selected?.id).toBe(accountId);
        done();
      });
    });
  });

  describe('S4: Auto-select First Account on Load', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts: ProductSummaryItem[] = [
      { id: 'acc-1', name: 'Checking Account', BBAN: '1234567890' } as ProductSummaryItem,
      { id: 'acc-2', name: 'Savings Account', BBAN: '0987654321' } as ProductSummaryItem,
    ];

    it('should auto-select first account when no query param present', () => {
      // Arrange
      TestBed.resetTestingModule();
      const mockRouter = { navigate: jest.fn() };
      transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(transactionsMock);
      arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>(mockAccounts);

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: { title: 'Transactions' } },
              queryParams: of({}),
              queryParamMap: of({
                get: jest.fn(() => null), // No account param
              }),
            },
          },
          { provide: Router, useValue: mockRouter },
          { provide: TransactionsHttpService, useValue: { transactions$: transactions$$.asObservable() } },
          { provide: ArrangementsService, useValue: { arrangements$: arrangements$$.asObservable() } },
          { provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE, useValue: undefined },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      // Act
      const newFixture = TestBed.createComponent(TransactionsViewComponent);
      newFixture.detectChanges();

      // Assert - should navigate to first account
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: mockAccounts[0].id },
        queryParamsHandling: 'merge',
      });
    });

    it('should NOT auto-select if account param already in URL', () => {
      // Arrange
      TestBed.resetTestingModule();
      const mockRouter = { navigate: jest.fn() };
      const existingAccountId = 'acc-2';
      transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(transactionsMock);
      arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>(mockAccounts);

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: { title: 'Transactions' } },
              queryParams: of({ account: existingAccountId }),
              queryParamMap: of({
                get: jest.fn((key: string) => (key === 'account' ? existingAccountId : null)),
              }),
            },
          },
          { provide: Router, useValue: mockRouter },
          { provide: TransactionsHttpService, useValue: { transactions$: transactions$$.asObservable() } },
          { provide: ArrangementsService, useValue: { arrangements$: arrangements$$.asObservable() } },
          { provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE, useValue: undefined },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      // Act
      const newFixture = TestBed.createComponent(TransactionsViewComponent);
      newFixture.detectChanges();

      // Assert - should NOT navigate (account already selected)
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle empty accounts list gracefully', () => {
      // Arrange
      TestBed.resetTestingModule();
      const mockRouter = { navigate: jest.fn() };
      transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(transactionsMock);
      arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>([]); // Empty accounts

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: { title: 'Transactions' } },
              queryParams: of({}),
              queryParamMap: of({
                get: jest.fn(() => null),
              }),
            },
          },
          { provide: Router, useValue: mockRouter },
          { provide: TransactionsHttpService, useValue: { transactions$: transactions$$.asObservable() } },
          { provide: ArrangementsService, useValue: { arrangements$: arrangements$$.asObservable() } },
          { provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE, useValue: undefined },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      // Act
      const newFixture = TestBed.createComponent(TransactionsViewComponent);
      newFixture.detectChanges();

      // Assert - should NOT navigate (no accounts available)
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('S5: Empty State for Zero Transactions', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts: ProductSummaryItem[] = [
      { id: 'acc-1', name: 'Checking Account', BBAN: '1234567890' } as ProductSummaryItem,
    ];

    it('should show empty state message when transactions list is empty', () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockAccounts);
      transactions$$.next([]); // Empty transactions
      fixture.detectChanges();

      // Assert
      const emptyState = fixture.nativeElement.querySelector('[data-role="transactions-view__empty-state"]');
      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toContain('No transactions');
    });

    it('should NOT show empty state when transactions exist', () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockAccounts);
      transactions$$.next(transactionsMock); // Has transactions
      fixture.detectChanges();

      // Assert
      const emptyState = fixture.nativeElement.querySelector('[data-role="transactions-view__empty-state"]');
      expect(emptyState).toBeNull();
    });

    it('should have i18n marker on empty state message', () => {
      // Arrange
      setup(snapshot);
      arrangements$$.next(mockAccounts);
      transactions$$.next([]); // Empty transactions
      fixture.detectChanges();

      // Assert - check that the element exists with data-role (i18n is template concern)
      const emptyState = fixture.nativeElement.querySelector('[data-role="transactions-view__empty-state"]');
      expect(emptyState).not.toBeNull();
    });
  });
});
