import { NgModule } from '@angular/core';
import {
  MakeTransferJourneyConfiguration,
  TransferJourneyModule
} from 'transfer-journey';

@NgModule({
  imports: [ TransferJourneyModule.forRoot() ],
  providers: [ {
    provide: MakeTransferJourneyConfiguration,
    useValue: {
      maskIndicator: false,
      maxTransactionAmount: 100,
    } as MakeTransferJourneyConfiguration
  } ],
})
export class TransferJourneyBundleModule {
}
