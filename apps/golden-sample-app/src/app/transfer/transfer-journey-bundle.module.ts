import { NgModule } from '@angular/core';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyConfiguration,
  TransferJourneyShellModule,
} from '@backbase-gsa/transfer-journey';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';

@NgModule({
  imports: [TransferJourneyShellModule.forRoot()],
  providers: [
    {
      provide: MakeTransferJourneyConfiguration,
      useValue: {
        maskIndicator: false,
        maxTransactionAmount: 100,
        slimMode: environment.common.designSlimMode,
      } as MakeTransferJourneyConfiguration,
    },
    {
      provide: MakeTransferCommunicationService,
      useExisting: JourneyCommunicationService,
    },
  ],
})
export class TransferJourneyBundleModule {}
