import { Router } from '@angular/router';
import { Transfer } from '@backbase-gsa/transfer';
import { JourneyCommunicationService } from './journey-communication.service';

describe('JourneyCommunicationService', () => {
  let service: JourneyCommunicationService;
  const mockRouter: Pick<Router, 'navigate'> = { navigate: jest.fn() };

  const mocktoAccount = 'mock to account';
  const mockAmount = 42;

  beforeEach(() => {
    service = new JourneyCommunicationService(mockRouter as Router);
    service.makeTransfer({
      toAccount: mocktoAccount,
      amount: mockAmount,
    } as Transfer);
  });

  it('should add transfer to latests transactions', (done) => {
    service.latestTransaction$.subscribe((received) => {
      expect(received?.transactionAmountCurrency.amount).toEqual(
        String(mockAmount)
      );
      expect(received?.merchant?.name).toEqual(mocktoAccount);
      done();
    });
  });

  it('should navigate to transactions when makeTransfer is called', () => {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions']);
  });
});
