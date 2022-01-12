import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  debitMockTransaction,
  transactionsMock,
} from '../../mocks/transactions-mocks';
import { TransactionsViewComponent } from './transactions-view.component';

describe('TransactionsViewComponent', () => {
  let scheduler: TestScheduler;
  let component: TransactionsViewComponent;
  let mockActivatedRoute: any = {};
  let mockTransactionViewService: any = {
    transactions$: of(transactionsMock),
  };
  let mockTransactionsCommunicationService: any = {
    latestTransaction$: of(debitMockTransaction),
  };
  const createComponent = () => {
    component = new TransactionsViewComponent(
      mockActivatedRoute,
      mockTransactionViewService,
      mockTransactionsCommunicationService
    );
  };
  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        data: {
          title: 'route',
        },
      },
    };
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
