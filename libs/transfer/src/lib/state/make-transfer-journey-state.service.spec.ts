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
      accountBalance: jasmine.createSpy().and.returnValue(1),
      getAccountById: jasmine.createSpy(),
      getAccounts: jasmine.createSpy(),
      makeTransfer: jasmine.createSpy(),
    };
    service = new MakeTransferJourneyState(
      accountsMock as MakeTransferAccountHttpService
    );
  });

  it('should allow share an object through an observable', (done) => {
    const subscription = service.transfer$
      .pipe(takeLast(1))
      .subscribe((value) => {
        expect(value).toEqual(transferMock);
        done();
      });

    service.next(transferMock);
    subscription.unsubscribe();
  });
});
