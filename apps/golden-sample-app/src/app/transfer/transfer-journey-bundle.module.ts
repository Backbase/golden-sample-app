import { Component, NgModule } from '@angular/core';
import { Route } from '@angular/router';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyConfiguration,
  TransferJourneyModule,
} from '@libs/transfer';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';

@Component({
  selector: 'app-my-custom-transfer-summary',
  template: `
    custom transfer summary
  `,
})
export class MyCustomTransferSummaryComponent { }

const override: Route = {
  path: 'make-transfer-summary',
  component: MyCustomTransferSummaryComponent,
};

@NgModule({
  imports: [TransferJourneyModule.forRoot({ routeOverrides: [override] })],
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
