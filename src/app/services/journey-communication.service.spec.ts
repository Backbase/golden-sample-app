import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Transfer } from 'transfer-journey';

import { JourneyCommunicationService } from './journey-communication.service';

describe('JourneyCommunicationService', () => {
  let service: JourneyCommunicationService;

  let mockRouter: jasmine.SpyObj<Router>;

  const mocktoAccount = 'mock to account';
  const mockAmount = 42;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    });
    service = TestBed.inject(JourneyCommunicationService);

    service.makeTransfer({
      toAccount: mocktoAccount,
      amount: mockAmount,
    } as Transfer);
  });

  it('should add transfer to latests transactions', (done: DoneFn) => {
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
