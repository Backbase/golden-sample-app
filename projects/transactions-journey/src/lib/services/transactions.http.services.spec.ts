import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionsHttpService } from './transactions.http.service';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';

describe('TransactionsHttpService', () => {
  let service: TransactionsHttpService;
  let httpMock: HttpTestingController;

  const transactions = [{
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600493600000
    },
    transaction: {
      amountCurrency: {
        amount: 5000,
        currencyCode: 'EUR'
      },
      type: 'Salaries',
      creditDebitIndicator: 'CRDT'
    },
    merchant: {
      name: 'Backbase',
      accountNumber: 'SI64397745065188826'
    }
  }, {
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600387200000
    },
    transaction: {
      amountCurrency: {
        amount: 82.02,
        currencyCode: 'EUR'
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'The Tea Lounge',
      accountNumber: 'SI64397745065188826'
    }
  }, {
    categoryCode: '#d51271',
    dates: {
      valueDate: 1600473600000
    },
    transaction: {
      amountCurrency: {
        amount: 84.64,
        currencyCode: 'EUR'
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'Texaco',
      accountNumber: 'SI64397745065188826'
    }
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransactionsHttpService,
        {
          provide: TransactionsJourneyConfiguration,
          useValue:  { pageSize: 2 },
        }
      ],


    });

    service = TestBed.inject(TransactionsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all the transactions', (done) => {
    service.transactions$.subscribe((data) => {
      expect(data).toEqual(transactions);
      done();
    });

    const req = httpMock.expectOne('/api/transactions?page=0&pageSize=2');
    expect(req.request.method).toBe('GET');
    req.flush(transactions);
  });
});
