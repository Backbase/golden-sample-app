import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  debitMockTransaction,
  transactionsMock,
} from '../../mocks/transactions-mocks';
import { TransactionsViewComponent } from './transactions-view.component';
import { TransactionsHttpService } from '../../services/transactions.http.service';
import { TransactionsCommunicationService } from '../../communication';

describe('TransactionsViewComponent', () => {
  const snapshot: Pick<ActivatedRouteSnapshot, 'data'> = {
    data: {
      title: 'someTitle',
    },
  };
  let scheduler: TestScheduler;
  let component: TransactionsViewComponent;
  const mockActivatedRoute: Pick<ActivatedRoute, 'snapshot'> = {
    snapshot: snapshot as ActivatedRouteSnapshot,
  };
  const mockTransactionsHttpService: Pick<
    TransactionsHttpService,
    'transactions$'
  > = {
    transactions$: of(transactionsMock),
  };
  let mockTransactionsCommunicationService:
    | Pick<TransactionsCommunicationService, 'latestTransaction$'>
    | undefined = {
    latestTransaction$: of(debitMockTransaction),
  };
  const createComponent = () => {
    component = new TransactionsViewComponent(
      mockActivatedRoute as ActivatedRoute,
      mockTransactionsHttpService as TransactionsHttpService,
      mockTransactionsCommunicationService as TransactionsCommunicationService
    );
  };
  beforeEach(() => {
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title', () => {
    expect(component.title).toBe(snapshot.data['title']);
  });

  describe('transaction', () => {
    beforeEach(() => {
      scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });
    it('should combine latest transactions with transactions', () => {
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(a|)';
        const expected = { a: [debitMockTransaction, ...transactionsMock] };
        expectObservable(component.transactions).toBe(expectedMarble, expected);
      });
    });
    it('should return transactions when no latest transactions exist', () => {
      mockTransactionsCommunicationService = undefined;
      createComponent();
      scheduler.run(({ expectObservable }) => {
        const expectedMarble = '(a|)';
        const expected = { a: [...transactionsMock] };
        expectObservable(component.transactions).toBe(expectedMarble, expected);
      });
    });
  });
});
