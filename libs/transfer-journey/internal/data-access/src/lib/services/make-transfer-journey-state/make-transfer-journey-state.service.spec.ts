import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Transfer } from '@backbase/transfer-journey/internal/shared-data';
import { MakeTransferAccountHttpService } from '../make-transfer-accounts/make-transfer-accounts.http.service';
import { MakeTransferJourneyState } from './make-transfer-journey-state.service';

describe('MakeTransferJourneyState', () => {
  let service: MakeTransferJourneyState;
  const mockAccountHttpService = {
    getAccounts: jest.fn(() => of([])),
    getAccountById: jest.fn(),
    accountBalance: jest.fn(),
    makeTransfer: jest.fn(),
    checkErrorStatus: jest.fn(),
  } as unknown as MakeTransferAccountHttpService;

  const transferMock: Transfer = {
    fromAccount: 'test-from-account',
    toAccount: 'test-to-account',
    amount: 100,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MakeTransferJourneyState,
        {
          provide: MakeTransferAccountHttpService,
          useValue: mockAccountHttpService,
        },
      ],
    });
    service = TestBed.inject(MakeTransferJourneyState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow share an object through an observable', (done) => {
    service.transfer$.subscribe((value) => {
      expect(value).toEqual(transferMock);
      done();
    });
    service.loadAccounts();
    service.next(transferMock);
  });
});
