import { NgModule } from '@angular/core';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyConfiguration,
  TransferJourneyModule
} from 'transfer-journey';
import { JourneyCommunicationService } from '../services/journey-communication.service';

@NgModule({
  imports: [ TransferJourneyModule.forRoot() ],
  providers: [ {
    provide: MakeTransferJourneyConfiguration,
    useValue: {
      maskIndicator: false,
      maxTransactionAmount: 100,
    } as MakeTransferJourneyConfiguration
  }, 
  {
    provide: MakeTransferCommunicationService,
    useExisting: JourneyCommunicationService,
  }],
})
export class TransferJourneyBundleModule {
}
