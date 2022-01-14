import { Transfer } from '@libs/transfer';
import { JourneyCommunicationService } from './journey-communication.service';

describe('JourneyCommunicationService', () => {
  let service: JourneyCommunicationService;
  const mockRouter: any = { navigate: jest.fn() };

  const mocktoAccount = 'mock to account';
  const mockAmount = 42;

  beforeEach(() => {
    service = new JourneyCommunicationService(mockRouter);
    service.makeTransfer({
      toAccount: mocktoAccount,
      amount: mockAmount,
    } as Transfer);
  });

  it('should add transfer to latests transactions', (done) => {
    service.latestTransaction$.subscribe((received) => {
      expect(received?.transaction.amountCurrency.amount).toEqual(mockAmount);
      expect(received?.merchant.name).toEqual(mocktoAccount);
      done();
    });
  });

  it('should navigate to transactions when makeTransfer is called', () => {
    expect(mockRouter.navigate).toHaveBeenCalledWith(['transactions']);
  });
});
