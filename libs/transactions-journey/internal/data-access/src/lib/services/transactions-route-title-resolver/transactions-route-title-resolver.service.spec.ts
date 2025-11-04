/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { TransactionsJourneyConfiguration } from '../transactions-journey-config/transactions-journey-config.service';
import { TransactionsRouteTitleResolverService } from './transactions-route-title-resolver.service';

describe('MakeTransferRouteTitleResolverService', () => {
  function setup(config: Partial<TransactionsJourneyConfiguration>) {
    TestBed.configureTestingModule({
      providers: [
        TransactionsRouteTitleResolverService,
        {
          provide: TransactionsJourneyConfiguration,
          useValue: config,
        },
      ],
    });
    return TestBed.inject(TransactionsRouteTitleResolverService);
  }

  it('should resolve route with the title data if the `slimMode` configuration is set as false', () => {
    const service = setup({ slimMode: false });
    const result = service.resolve({
      data: {
        title: 'hello',
      },
    } as any);

    expect(result).toBe('hello');
  });

  it('should resolve route without the title data if the `slimMode` configuration is set as true', () => {
    const service = setup({ slimMode: true });
    const result = service.resolve({
      data: {
        title: 'hello',
      },
    } as any);

    expect(result).toBe('');
  });
});
