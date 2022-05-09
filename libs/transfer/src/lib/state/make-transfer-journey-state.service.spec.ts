import { of } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { Transfer } from '../model/Account';
import { MakeTransferAccountHttpService } from '../services/make-transfer-accounts.http.service';
import { MakeTransferJourneyState } from './make-transfer-journey-state.service';

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
    service = new MakeTransferJourneyState(
      accountsMock as MakeTransferAccountHttpService
    );
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
