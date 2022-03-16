import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';
import { TransactionsRouteTitleResolverService } from './transactions-route-title-resolver.service';

describe('MakeTransferRouteTitleResolverService', () => {
  function createInstance(config: Partial<TransactionsJourneyConfiguration>) {
    return new TransactionsRouteTitleResolverService(
      config as TransactionsJourneyConfiguration
    );
  }

  it('should resolve route with the title data if the `slimMode` configuration is set as false', () => {
    const service = createInstance({ slimMode: false });
    const result = service.resolve(
      {
        data: {
          title: 'hello',
        },
      } as any,
      {} as any
    );

    expect(result).toBe('hello');
  });

  it('should resolve route without the title data if the `slimMode` configuration is set as true', () => {
    const service = createInstance({ slimMode: true });
    const result = service.resolve(
      {
        data: {
          title: 'hello',
        },
      } as any,
      {} as any
    );

    expect(result).toBe('');
  });
});
