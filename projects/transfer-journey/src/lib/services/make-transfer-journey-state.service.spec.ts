import { takeLast } from "rxjs/operators";
import { Transfer } from "../model/Account";
import { MakeTransferJourneyState } from "./make-transfer-journey-state.service";

describe('MakeTransferJourneyState', () => {
  let service: MakeTransferJourneyState;

  beforeEach(() => {
    service = new MakeTransferJourneyState();
  });

  it('should allow share an object through an observable', (done) => {
    const transferMock: Transfer = {
      amount: 100,
      fromAccount: '111',
      toAccount: '222',
    };

    service.transfer.pipe(takeLast(1)).subscribe((value) => {
      expect(value).toEqual(transferMock);
      done();
    });

    service.next(transferMock);
    service.ngOnDestroy();
  });
});