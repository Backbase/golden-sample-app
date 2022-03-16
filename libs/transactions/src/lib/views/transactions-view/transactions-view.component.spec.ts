import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { BehaviorSubject } from 'rxjs';
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '../../communication';
import { TextFilterComponent } from '../../components/text-filter/text-filter.component';
import {
  debitMockTransaction,
  transactionsMock,
} from '../../mocks/transactions-mocks';
import { FilterTransactionsPipe } from '../../pipes/filter-transactions.pipe';
import { TransactionsHttpService } from '../../services/transactions.http.service';
import { TransactionsViewComponent } from './transactions-view.component';
import { By } from '@angular/platform-browser';

describe('TransactionsViewComponent', () => {
  let transactions$$: BehaviorSubject<TransactionItem[] | undefined>;
  let mockTransactionsHttpService: Pick<
    TransactionsHttpService,
    'transactions$'
  >;
  let latestTransactions$$: BehaviorSubject<TransactionItem | undefined>;
  let mockTransactionsCommunicationService:
    | Pick<TransactionsCommunicationService, 'latestTransaction$'>
    | undefined;

  let fixture: ComponentFixture<TransactionsViewComponent>;

  const setup = (snapshot: Pick<ActivatedRouteSnapshot, 'data'>) => {
    transactions$$ = new BehaviorSubject<TransactionItem[] | undefined>(
      undefined
    );
    mockTransactionsHttpService = {
      transactions$: transactions$$.asObservable(),
    };
    latestTransactions$$ = new BehaviorSubject<TransactionItem | undefined>(
      undefined
    );
    mockTransactionsCommunicationService = {
      latestTransaction$: latestTransactions$$.asObservable(),
    };

    TestBed.configureTestingModule({
      declarations: [
        TransactionsViewComponent,
        TextFilterComponent,
        FilterTransactionsPipe,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: snapshot as ActivatedRouteSnapshot,
          },
        },
        {
          provide: TransactionsHttpService,
          useValue: mockTransactionsHttpService,
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

  it('should set title from the route data', () => {
    const snapshot = {
      data: {
        title: 'someTitle',
      },
    };

    setup(snapshot);

    const title = elements.getTitle();
    expect(title.innerHTML).toBe(snapshot.data['title']);
  });

  it('should render loading state if transactions are pending', () => {
    const snapshot = {
      data: {
        title: 'someTitle',
      },
    };

    setup(snapshot);
    const loadingState = elements.getLoadingState();
    expect(loadingState).not.toBeNull();
  });

  describe('transaction', () => {
    beforeEach(() => {
      transactions$$.next(transactionsMock);
      fixture.detectChanges();
      const snapshot = {
        data: {
          title: 'someTitle',
        },
      };

      setup(snapshot);
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

  describe('when there is no title specified', () => {
    it('should not create the title element in the dom', () => {
      const snapshot = {
        data: {
          title: '',
        },
      };

      setup(snapshot);

      expect(fixture.debugElement.query(By.css('h1'))).toBe(undefined);
    });
  });
});
