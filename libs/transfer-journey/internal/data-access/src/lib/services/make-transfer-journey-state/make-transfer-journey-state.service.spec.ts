import { of } from 'rxjs';
import { Transfer } from '@backbase/transfer-journey/internal/shared-data';
import { MakeTransferAccountHttpService } from '../make-transfer-accounts/make-transfer-accounts.http.service';
import { MakeTransferJourneyState } from './make-transfer-journey-state.service';
import { TestBed } from '@angular/core/testing';

describe('MakeTransferJourneyState', () => {
  let service: MakeTransferJourneyState;
  let accountsMock: Pick<
    MakeTransferAccountHttpService,
    'accountBalance' | 'getAccountById' | 'getAccounts' | 'makeTransfer'
  >;
  const transferMock: Transfer = {
    amount: 100,
    fromAccount: '111',
    toAccount: '222',
  };

  beforeEach(() => {
    accountsMock = {
      accountBalance: jest.fn().mockReturnValue(1),
      getAccountById: jest.fn().mockReturnValue(of([])),
      getAccounts: jest.fn().mockReturnValue(of([])),
      makeTransfer: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        MakeTransferJourneyState,
        { provide: MakeTransferAccountHttpService, useValue: accountsMock },
      ]
    });
    service = TestBed.inject(MakeTransferJourneyState);
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
