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

    beforeEach(() => {
      setup(snapshot);
    });

    it('should render account selector element', () => {
      const accountSelector = fixture.nativeElement.querySelector(
        'bb-account-selector-ui'
      );
      expect(accountSelector).toBeTruthy();
    });

    it('should render account selector with data-role attribute', () => {
      const accountSelector = fixture.nativeElement.querySelector(
        '[data-role="transactions-view__account-selector"]'
      );
      expect(accountSelector).toBeTruthy();
    });
  });

  describe('S3: Account Selection Logic', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockAccounts: Partial<ProductSummaryItem>[] = [
      { id: 'account-1', name: 'Checking Account', bankAlias: 'Checking' },
      { id: 'account-2', name: 'Savings Account', bankAlias: 'Savings' },
    ];

    let mockRouter: { navigate: jest.Mock };

    beforeEach(() => {
      setup(snapshot);
      mockRouter = TestBed.inject(Router) as unknown as { navigate: jest.Mock };
      arrangements$$.next(mockAccounts as ProductSummaryItem[]);
      fixture.detectChanges();
    });

    it('should expose accounts$ observable from ArrangementsService', (done) => {
      // Arrange - accounts already set in beforeEach

      // Act
      fixture.componentInstance.accounts$.subscribe((accounts) => {
        // Assert
        expect(accounts).toEqual(mockAccounts);
        done();
      });
    });

    it('should navigate with query param when account selected', () => {
      // Arrange
      const selectedAccount = { id: 'account-2' };

      // Act
      fixture.componentInstance.onAccountSelected(selectedAccount);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        relativeTo: expect.anything(),
        queryParams: { account: 'account-2' },
        queryParamsHandling: 'merge',
      });
    });

    it('should call router.navigate with correct account id', () => {
      // Arrange
      const selectedAccount = { id: 'account-1' };

      // Act
      fixture.componentInstance.onAccountSelected(selectedAccount);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({
          queryParams: { account: 'account-1' },
        })
      );
    });
  });

  describe('S4: Transaction Filtering by Account', () => {
    const snapshot = {
      data: {
        title: 'Transactions',
      },
    };

    const mockTransactionsWithAccounts: Partial<TransactionItem>[] = [
      { id: 'tx-1', arrangementId: 'account-1', counterPartyName: 'Store A' },
      { id: 'tx-2', arrangementId: 'account-1', counterPartyName: 'Store B' },
      { id: 'tx-3', arrangementId: 'account-2', counterPartyName: 'Store C' },
      { id: 'tx-4', arrangementId: 'account-2', counterPartyName: 'Store D' },
    ];

    const setupWithAccountFilter = (accountId: string | null) => {
      transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(
        undefined
      );
      arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>([]);
      const mockTransactionsHttpService = {
        transactions$: transactions$$.asObservable(),
      };
      const mockArrangementsService = {
        arrangements$: arrangements$$.asObservable(),
      };
      const latestTransactions$$ = new BehaviorSubject<
        TransactionItem | undefined
      >(undefined);
      const mockTransactionsCommunicationService = {
        latestTransaction$: latestTransactions$$.asObservable(),
      };

      TestBed.configureTestingModule({
        declarations: [TransactionsViewComponent],
        imports: [MockTextFilterComponent, FilterTransactionsPipe],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { data: snapshot.data },
              queryParams: of({}),
              queryParamMap: of({
                get: jest.fn((key: string) =>
                  key === 'account' ? accountId : ''
                ),
              }),
            },
          },
          {
            provide: Router,
            useValue: { navigate: jest.fn() },
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

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should filter transactions by account-1 when query param is set', (done) => {
      // Arrange
      setupWithAccountFilter('account-1');
      transactions$$.next(mockTransactionsWithAccounts as TransactionItem[]);
      fixture.detectChanges();

      // Act & Assert
      fixture.componentInstance.transactions$.subscribe((filtered) => {
        expect(filtered.length).toBe(2);
        expect(filtered.every((tx) => tx.arrangementId === 'account-1')).toBe(
          true
        );
        done();
      });
    });

    it('should filter transactions by account-2 when query param is set', (done) => {
      // Arrange
      setupWithAccountFilter('account-2');
      transactions$$.next(mockTransactionsWithAccounts as TransactionItem[]);
      fixture.detectChanges();

      // Act & Assert
      fixture.componentInstance.transactions$.subscribe((filtered) => {
        expect(filtered.length).toBe(2);
        expect(filtered.every((tx) => tx.arrangementId === 'account-2')).toBe(
          true
        );
        done();
      });
    });

    it('should show all transactions when no account filter is set', (done) => {
      // Arrange
      setupWithAccountFilter(null);
      transactions$$.next(mockTransactionsWithAccounts as TransactionItem[]);
      fixture.detectChanges();

      // Act & Assert
      fixture.componentInstance.transactions$.subscribe((filtered) => {
        expect(filtered.length).toBe(4);
        done();
      });
    });
  });
});
