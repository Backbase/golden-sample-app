import { Provider } from "@angular/core";
import { MakeTransferJourneyConfiguration, MakeTransferJourneyConfigurationToken } from "projects/transfer-journey/src/public-api";

export const MakeTransferConfigProvider: Provider = {
  provide: MakeTransferJourneyConfigurationToken,
  useValue: {
    maskIndicator: false,
  } as MakeTransferJourneyConfiguration
};
