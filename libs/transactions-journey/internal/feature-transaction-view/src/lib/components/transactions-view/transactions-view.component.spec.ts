import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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
import { TRANSACTION_EXTENSIONS_CONFIG } from '../../extensions';

@Component({
  selector: 'bb-text-filter',
  standalone: true,
  template: '',
})
class MockTextFilterComponent {}

@Component({
  selector: 'bb-loading-indicator-ui',
  standalone: true,
  template: '',
})
class MockLoadingIndicatorComponent {}

@Component({
  selector: 'bb-badge-ui',
  standalone: true,
  template: '',
})
class MockBadgeComponent {}

@Component({
  selector: 'bb-transaction-item',
  standalone: true,
  template: '',
})
class MockTransactionItemComponent {
  transaction = {};
  categoryName = '';
}

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
  let router: Router;
  let fixture: ComponentFixture<TransactionsViewComponent>;

  const setup = async (
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

    await TestBed.configureTestingModule({
      imports: [
        TransactionsViewComponent,
        RouterTestingModule.withRoutes([
          { path: 'transactions', component: TransactionsViewComponent },
          { path: 'transactions/:id', component: TransactionsViewComponent },
        ]),
        MockTextFilterComponent,
        MockLoadingIndicatorComponent,
        MockBadgeComponent,
        MockTransactionItemComponent,
        FilterTransactionsPipe,
      ],
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
        {
          provide: TRANSACTION_EXTENSIONS_CONFIG,
          useValue: {
            transactionItemAdditionalDetails: undefined,
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    await router.initialNavigation();

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
      beforeEach(async () => {
        await setup(snapshot, true);
        transactions$$.next(transactionsMock);
        fixture.detectChanges();
      });

      it('should render loading state if transactions are pending', fakeAsync(() => {
        const loadingState = elements.getLoadingState();
        expect(loadingState).not.toBeNull();
        tick(300);
      }));
    });

    describe('when the server response correctly', () => {
      beforeEach(async () => {
        await setup(snapshot);
        transactions$$.next(transactionsMock);
        fixture.detectChanges();
      });

      it('should set title from the route data', fakeAsync(() => {
        const title = elements.getTitle();
        expect(title.innerHTML.trim()).toBe(snapshot.data['title']);
        tick();
      }));

      it('should render proper amount of transaction items', fakeAsync(() => {
        const transactionItems = elements.getTransactionItems();
        expect(transactionItems.length).toBe(transactionsMock.length);
        tick();
      }));

      it('should render additional transaction received from communication service', fakeAsync(() => {
        latestTransactions$$.next(debitMockTransaction);
        fixture.detectChanges();

        const transactionItems = elements.getTransactionItems();
        expect(transactionItems.length).toBe(transactionsMock.length + 1);
        tick();
      }));

      it('should render transactions without error if communication service was not provided', fakeAsync(() => {
        mockTransactionsCommunicationService = undefined;
        fixture.detectChanges();

        const transactionItems = elements.getTransactionItems();
        expect(transactionItems.length).toBe(transactionsMock.length);
        tick();
      }));
    });
  });

  describe('when there is no title specified', () => {
    it('should not create the title element in the dom', async () => {
      const snapshot = {
        data: {
          title: '',
        },
      };

      await setup(snapshot);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('h1'))).toBeFalsy();
    });
  });
});
