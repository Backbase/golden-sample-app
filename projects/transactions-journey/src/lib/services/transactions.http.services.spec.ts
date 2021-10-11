import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionsHttpService } from './transactions.http.service';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';
import { transactionsMock } from '../mocks/transactions-mocks';

describe('TransactionsHttpService', () => {
  let service: TransactionsHttpService;
  let httpMock: HttpTestingController;

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
      expect(data).toEqual(transactionsMock);
      done();
    });

    const req = httpMock.expectOne('/api/transactions?page=0&pageSize=2');
    expect(req.request.method).toBe('GET');
    req.flush(transactionsMock);
  });
});
