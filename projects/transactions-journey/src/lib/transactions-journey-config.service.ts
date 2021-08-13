import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface TransactionsJourneyConfiguration {
  pageSize: number;
}

export const TransactionsJourneyConfigurationToken = new InjectionToken<TransactionsJourneyConfiguration>('TransactionsJourneyConfiguration injection token');

const configDefaults: TransactionsJourneyConfiguration = {
  pageSize: 20,
};

@Injectable()
export class TransactionsJourneyConfigService {
  private config: TransactionsJourneyConfiguration;

  constructor(@Optional() @Inject(TransactionsJourneyConfigurationToken) config: TransactionsJourneyConfiguration ) {
    this.config = { ...configDefaults, ...config };
  }

  get defaults(): TransactionsJourneyConfiguration {
    return configDefaults;
  }

  get pageSize(): number {
    return this.config.pageSize;
  }
}
