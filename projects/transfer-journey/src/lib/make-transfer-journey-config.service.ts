import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";

export interface MakeTransferJourneyConfiguration {
  maskIndicator: boolean;
}

export const MakeTransferJourneyConfigurationToken = new InjectionToken<MakeTransferJourneyConfiguration>('AccountsTransactionsJourneyConfiguration injection token');

const configDefaults: MakeTransferJourneyConfiguration = {
  maskIndicator: true,
}


@Injectable()
export class MakeTransferJourneyConfigService {
  private _config: MakeTransferJourneyConfiguration;
  
  constructor(@Optional() @Inject(MakeTransferJourneyConfigurationToken) config: MakeTransferJourneyConfiguration ) {
    this._config = { ...configDefaults, ...config };
  }

  get defaults(): MakeTransferJourneyConfiguration {
    return configDefaults;
  }

  get maskIndicator(): boolean {
    return this._config.maskIndicator;
  }
}
