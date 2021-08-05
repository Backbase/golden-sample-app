import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface MakeTransferJourneyConfiguration {
  maskIndicator: boolean;
}

export const MakeTransferJourneyConfigurationToken = new InjectionToken<MakeTransferJourneyConfiguration>('AccountsTransactionsJourneyConfiguration injection token');

const configDefaults: MakeTransferJourneyConfiguration = {
  maskIndicator: true,
};

@Injectable()
export class MakeTransferJourneyConfigService {
  private config: MakeTransferJourneyConfiguration;

  constructor(@Optional() @Inject(MakeTransferJourneyConfigurationToken) config: MakeTransferJourneyConfiguration ) {
    this.config = { ...configDefaults, ...config };
  }

  get defaults(): MakeTransferJourneyConfiguration {
    return configDefaults;
  }

  get maskIndicator(): boolean {
    return this.config.maskIndicator;
  }
}
