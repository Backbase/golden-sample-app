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
});

import { AccountSelectorItem } from './transactions-view.component';

/**
 * Test suite for S3: Account Selector Logic
 * JIRA-001: View Transactions by Account
 */
describe('S3: Account Selector Logic', () => {
  let transactions$$: BehaviorSubject<TransactionItem[] | undefined>;
  let arrangements$$: BehaviorSubject<ProductSummaryItem[]>;
  let queryParamMap$$: BehaviorSubject<{ get: (key: string) => string | null }>;
  let mockRouter: { navigate: jest.Mock };
  let fixture: ComponentFixture<TransactionsViewComponent>;
  let component: TransactionsViewComponent;

  const mockAccounts: ProductSummaryItem[] = [
    {
      id: 'account-1',
      name: 'Checking Account',
      BBAN: '1234567890',
      IBAN: 'NL91ABNA0417164300',
      bankAlias: 'My Checking',
    } as ProductSummaryItem,
    {
      id: 'account-2',
      name: 'Savings Account',
      IBAN: 'NL91ABNA0417164301',
      bankAlias: 'My Savings',
    } as ProductSummaryItem,
  ];

  const mockTransactions: TransactionItem[] = [
    { ...debitMockTransaction, id: 'tx-1', arrangementId: 'account-1' },
    { ...debitMockTransaction, id: 'tx-2', arrangementId: 'account-1' },
    { ...debitMockTransaction, id: 'tx-3', arrangementId: 'account-2' },
  ];

  const setup = (accountIdInUrl: string | null = null) => {
    transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(
      mockTransactions
    );
    arrangements$$ = new BehaviorSubject<ProductSummaryItem[]>(mockAccounts);
    queryParamMap$$ = new BehaviorSubject({
      get: (key: string) => (key === 'account' ? accountIdInUrl : null),
    });
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [TransactionsViewComponent],
      imports: [MockTextFilterComponent, FilterTransactionsPipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { title: 'Transactions' } },
            queryParams: of({}),
            queryParamMap: queryParamMap$$.asObservable(),
          },
        },
        { provide: Router, useValue: mockRouter },
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

    fixture = TestBed.createComponent(TransactionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('accounts$ observable', () => {
    it('should_expose_accounts_with_mapped_items', (done) => {
      // Arrange
      setup();

      // Act & Assert
      component.accounts$.subscribe((accounts: AccountSelectorItem[]) => {
        expect(accounts.length).toBe(2);
        expect(accounts[0].id).toBe('account-1');
        expect(accounts[0].name).toBe('Checking Account');
        done();
      });
    });

    it('should_map_BBAN_to_account_number', (done) => {
      // Arrange
      setup();

      // Act & Assert
      component.accounts$.subscribe((accounts: AccountSelectorItem[]) => {
        // First account has BBAN
        expect(accounts[0].number).toBe('1234567890');
        done();
      });
    });

    it('should_fallback_to_IBAN_when_BBAN_not_available', (done) => {
      // Arrange
      setup();

      // Act & Assert
      component.accounts$.subscribe((accounts: AccountSelectorItem[]) => {
        // Second account has no BBAN, should use IBAN
        expect(accounts[1].number).toBe('NL91ABNA0417164301');
        done();
      });
    });
  });

  describe('selectedAccount$ observable', () => {
    it('should_expose_selectedAccount_based_on_URL_param', (done) => {
      // Arrange
      setup('account-1');

      // Act & Assert
      component.selectedAccount$.subscribe((account: ProductSummaryItem | undefined) => {
        expect(account?.id).toBe('account-1');
        done();
      });
    });

    it('should_return_undefined_when_no_account_in_URL', (done) => {
      // Arrange
      setup(null);

      // Act & Assert
      component.selectedAccount$.subscribe((account: ProductSummaryItem | undefined) => {
        // When no account in URL and no auto-select yet
        expect(account).toBeUndefined();
        done();
      });
    });
  });

  describe('onAccountSelected()', () => {
    it('should_update_URL_when_account_selected', () => {
      // Arrange
      setup();
      const selectedAccount: AccountSelectorItem = { id: 'account-2', name: 'Savings', number: '123' };

      // Act
      component.onAccountSelected(selectedAccount);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'account-2' },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('auto-select first account', () => {
    it('should_navigate_to_first_account_when_no_account_in_URL', () => {
      // Arrange & Act
      setup(null);

      // Assert - should navigate to first account
      // Note: This happens via initDefaultAccount logic
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { account: 'account-1' },
        queryParamsHandling: 'merge',
      });
    });

    it('should_not_navigate_when_account_already_in_URL', () => {
      // Arrange & Act
      setup('account-1');

      // Assert - should not navigate since account is already set
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
