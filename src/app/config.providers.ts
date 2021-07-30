import { Provider } from "@angular/core";
import { MakeTransferJourneyConfigurationToken, MakeTransferJourneyConfiguration } from 'transfer-journey';

export const MakeTransferConfigProvider: Provider = {
  provide: MakeTransferJourneyConfigurationToken,
  useValue: {
    maskIndicator: false,
  } as MakeTransferJourneyConfiguration
};
