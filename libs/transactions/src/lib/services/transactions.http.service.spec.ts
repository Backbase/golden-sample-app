import {
  TransactionClientHttpService,
  TransactionItem,
} from '@backbase/data-ang/transactions';
import { of } from 'rxjs';
import { ArrangementsService } from './arrangements.service';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';
import { TransactionsHttpService } from './transactions.http.service';

describe('TransactionsHttpService', () => {
  let service: TransactionsHttpService;
  const mockArrangenements = [{ id: 'arrangement-mock' }];
  const mockPageSize = 10;
  const mockTransactionItems = [{}, {}] as TransactionItem[];

  const mockConfigurationService = {
    pageSize: mockPageSize,
  } as TransactionsJourneyConfiguration;
  const mockTransactionsClientHttpService = {
    getTransactionsWithPost: jest.fn(() => of(mockTransactionItems)),
  } as unknown as TransactionClientHttpService;
  const mockArrangementsService = {
    arrangements$: of(mockArrangenements),
  } as ArrangementsService;

  beforeEach(() => {
    service = new TransactionsHttpService(
      mockConfigurationService,
      mockTransactionsClientHttpService,
      mockArrangementsService
    );

    jest.spyOn(mockTransactionsClientHttpService, 'getTransactionsWithPost');
  });

  it('should call transactions client http service to get the transactions', (done) => {
    service.transactions$.subscribe(() => {
      expect(
        mockTransactionsClientHttpService.getTransactionsWithPost
      ).toHaveBeenCalledWith(
        {
          transactionListRequest: {
            arrangementsIds: mockArrangenements.map((a) => a.id),
            size: mockPageSize,
            from: 0,
            orderBy: 'bookingDate',
            direction: 'DESC',
            state: 'COMPLETED',
          },
        },
        'body'
      );

      done();
    });
  });

  it('should respond with transactions data', (done) => {
    service.transactions$.subscribe((received) => {
      expect(received).toBe(mockTransactionItems);
      done();
    });
  });
});
