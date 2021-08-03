import { NgModule } from '@angular/core';
import {
  MakeTransferJourneyConfiguration,
  MakeTransferJourneyConfigurationToken,
  TransferJourneyModule
} from 'transfer-journey';

@NgModule({
  imports: [ TransferJourneyModule.forRoot() ],
  providers: [ {
    provide: MakeTransferJourneyConfigurationToken,
    useValue: {
      maskIndicator: false,
    } as MakeTransferJourneyConfiguration
  } ],
})
export class TransferJourneyBundleModule {
}
