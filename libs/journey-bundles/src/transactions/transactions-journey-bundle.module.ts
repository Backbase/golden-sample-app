import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE
} from '@backbase-gsa/transactions-journey';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { CommonModule } from '@angular/common';
import { EnvironmentService, JourneyCommunicationService } from '@backbase-gsa/shared';

@NgModule({
  imports: [
    CommonModule,
    TransactionsJourneyModule.forRoot({
      extensionSlots: {
        transactionItemAdditionalDetails:
        TransactionItemAdditionalDetailsComponent
      }
    })
  ],
  declarations: [TransactionItemAdditionalDetailsComponent],
  providers: [
    {
      provide: TransactionsJourneyConfiguration,
      deps: [EnvironmentService],
      useFactory: (envService: EnvironmentService) => ({
        pageSize: 10,
        slimMode: envService.environment?.common.designSlimMode
      } as TransactionsJourneyConfiguration)
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService
    }
  ]
})
export class TransactionsJourneyBundleModule {
}
