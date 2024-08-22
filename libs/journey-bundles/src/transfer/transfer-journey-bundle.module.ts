import { NgModule } from '@angular/core';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyConfiguration,
  TransferJourneyShellModule
} from '@backbase-gsa/transfer-journey';
import { JourneyCommunicationService, EnvironmentService } from '@backbase-gsa/shared';

@NgModule({
  imports: [TransferJourneyShellModule.forRoot()],
  providers: [
    {
      provide: MakeTransferJourneyConfiguration,
      deps: [EnvironmentService],
      useFactory: (envService: EnvironmentService) => ({
        maskIndicator: false,
        maxTransactionAmount: 100,
        slimMode: envService.environment?.common.designSlimMode
      } as MakeTransferJourneyConfiguration)
    },
    {
      provide: MakeTransferCommunicationService,
      useExisting: JourneyCommunicationService
    }
  ]
})
export class TransferJourneyBundleModule {
}
