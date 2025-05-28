import { NgModule } from '@angular/core';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyConfiguration,
  TransferJourneyShellModule,
} from '@backbase/transfer-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import {
  Environment,
  ENVIRONMENT_CONFIG,
} from '@backbase/shared/util/config';

@NgModule({
  imports: [TransferJourneyShellModule.forRoot()],
  providers: [
    {
      provide: MakeTransferJourneyConfiguration,
      useFactory: (
        environment: Environment
      ): MakeTransferJourneyConfiguration => ({
        maskIndicator: false,
        maxTransactionAmount: 100,
        slimMode: environment.common.designSlimMode,
      }),
      deps: [ENVIRONMENT_CONFIG],
    },
    {
      provide: MakeTransferCommunicationService,
      useExisting: JourneyCommunicationService,
    },
  ],
})
export class TransferJourneyBundleModule {}
