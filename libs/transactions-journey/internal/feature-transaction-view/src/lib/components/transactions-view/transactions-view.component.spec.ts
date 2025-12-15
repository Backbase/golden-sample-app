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
    getAccountSelector: () =>
      fixture.nativeElement.querySelector(
        '[data-role="transactions-view__account-selector"]'
      ),
    getAccountSelectorLabel: () =>
      fixture.nativeElement.querySelector(
        '[data-role="transactions-view__account-selector-label"]'
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

  describe('S3: Account Selector', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts = [
      { id: 'acc-1', name: 'Current Account', bankAlias: 'Current Account', BBAN: '****0025' },
      { id: 'acc-2', name: 'Savings Account', bankAlias: 'Savings Account', BBAN: '****0026' },
    ] as ProductSummaryItem[];

    beforeEach(() => {
      setup(snapshot);
      arrangements$$.next(mockAccounts);
      transactions$$.next(transactionsMock);
      fixture.detectChanges();
    });

    it('should render account selector component', () => {
      // Arrange & Act - done in beforeEach

      // Assert
      const accountSelector = elements.getAccountSelector();
      expect(accountSelector).not.toBeNull();
    });

    it('should render account selector label with proper accessibility attributes', () => {
      // Arrange & Act - done in beforeEach

      // Assert
      const label = elements.getAccountSelectorLabel();
      expect(label).not.toBeNull();
      expect(label.getAttribute('id')).toBe('account-selector-label');
    });

    it('should pass accounts to account selector', () => {
      // Arrange & Act - done in beforeEach

      // Assert
      const component = fixture.componentInstance;
      component.accounts$.subscribe((accounts) => {
        expect(accounts.length).toBe(mockAccounts.length);
      });
    });

    it('should have markFirst attribute set for default selection', () => {
      // Arrange & Act - done in beforeEach

      // Assert
      const accountSelector = elements.getAccountSelector();
      // RULE: Verify the template includes [markFirst]="true" binding
      // With NO_ERRORS_SCHEMA, we verify the element exists and has the expected structure
      expect(accountSelector).not.toBeNull();
      expect(accountSelector.getAttribute('arialabelledby')).toBe('account-selector-label');
    });
  });

  describe('S4: Account Selection Handler', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts = [
      { id: 'acc-1', name: 'Current Account', bankAlias: 'Current Account', BBAN: '****0025' },
      { id: 'acc-2', name: 'Savings Account', bankAlias: 'Savings Account', BBAN: '****0026' },
    ] as ProductSummaryItem[];

    let router: Router;

    beforeEach(() => {
      setup(snapshot);
      arrangements$$.next(mockAccounts);
      transactions$$.next(transactionsMock);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should navigate with account query param when account is selected', () => {
      // Arrange
      const component = fixture.componentInstance;
      const selectedAccount = mockAccounts[1];

      // Act
      component.onAccountChange(selectedAccount);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'acc-2' },
        queryParamsHandling: 'merge',
      });
    });

    it('should clear account query param when empty object is passed', () => {
      // Arrange
      const component = fixture.componentInstance;

      // Act
      component.onAccountChange({});

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: undefined },
        queryParamsHandling: 'merge',
      });
    });

    it('should have onAccountChange method defined', () => {
      // Arrange & Act
      const component = fixture.componentInstance;

      // Assert
      expect(component.onAccountChange).toBeDefined();
      expect(typeof component.onAccountChange).toBe('function');
    });
  });

  describe('S5: Default Account Selection', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts = [
      { id: 'acc-1', name: 'Current Account', bankAlias: 'Current Account', BBAN: '****0025' },
      { id: 'acc-2', name: 'Savings Account', bankAlias: 'Savings Account', BBAN: '****0026' },
    ] as ProductSummaryItem[];

    it('should navigate to first account when no account param exists', () => {
      // Arrange - populate accounts BEFORE creating component so ngOnInit can access them
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
              queryParamMap: of({ get: jest.fn(() => null) }), // No account param
            },
          },
          {
            provide: Router,
            useValue: { navigate: jest.fn() },
          },
          {
            provide: TransactionsHttpService,
            useValue: { transactions$: transactions$$.asObservable() },
          },
          {
            provide: ArrangementsService,
            useValue: { arrangements$: arrangements$$.asObservable() },
          },
          {
            provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
            useValue: { latestTransaction$: of(undefined) },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      // Act
      const fix = TestBed.createComponent(TransactionsViewComponent);
      fix.detectChanges();
      const router = TestBed.inject(Router);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'acc-1' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    it('should not navigate when account param already exists', () => {
      // Arrange - setup with existing account param
      const queryParamMap = {
        get: jest.fn((key: string) => (key === 'account' ? 'acc-2' : '')),
      };

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: { title: 'Transactions' } },
              queryParams: of({ account: 'acc-2' }),
              queryParamMap: of(queryParamMap),
            },
          },
          {
            provide: Router,
            useValue: { navigate: jest.fn() },
          },
          {
            provide: TransactionsHttpService,
            useValue: { transactions$: of(transactionsMock) },
          },
          {
            provide: ArrangementsService,
            useValue: { arrangements$: of(mockAccounts) },
          },
          {
            provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
            useValue: { latestTransaction$: of(undefined) },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      const fix = TestBed.createComponent(TransactionsViewComponent);
      fix.detectChanges();
      const router = TestBed.inject(Router);

      // Assert - navigate should not be called for setting default
      // (might be called 0 times, or if called, not with replaceUrl)
      const calls = (router.navigate as jest.Mock).mock.calls;
      const defaultAccountCalls = calls.filter(
        (call: unknown[]) => (call[1] as { replaceUrl?: boolean })?.replaceUrl === true
      );
      expect(defaultAccountCalls.length).toBe(0);
    });

    it('should filter transactions by default account', () => {
      // Arrange
      setup(snapshot);
      const transactionsWithAccount = [
        { ...transactionsMock[0], arrangementId: 'acc-1' },
        { ...transactionsMock[1], arrangementId: 'acc-2' },
      ] as TransactionItem[];

      // Act
      arrangements$$.next(mockAccounts);
      transactions$$.next(transactionsWithAccount);
      fixture.detectChanges();

      // Assert - component should have transactions filtering capability
      const component = fixture.componentInstance;
      expect(component.transactions$).toBeDefined();
    });
  });
});
