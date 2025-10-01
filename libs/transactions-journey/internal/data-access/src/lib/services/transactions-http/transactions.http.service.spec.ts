import {
  TransactionClientHttpService,
  TransactionItem,
} from '@backbase/transactions-http-ang';
import { of } from 'rxjs';
import { ArrangementsService } from '../arrangements/arrangements.service';
import { TransactionsJourneyConfiguration } from '../transactions-journey-config/transactions-journey-config.service';
import { TransactionsHttpService } from './transactions.http.service';
import { TestBed } from '@angular/core/testing';

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
    TestBed.configureTestingModule({
      providers: [
        TransactionsHttpService,
        {
          provide: TransactionsJourneyConfiguration,
          useValue: mockConfigurationService,
        },
        {
          provide: TransactionClientHttpService,
          useValue: mockTransactionsClientHttpService,
        },
        { provide: ArrangementsService, useValue: mockArrangementsService },
      ],
    });
    service = TestBed.inject(TransactionsHttpService);
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
