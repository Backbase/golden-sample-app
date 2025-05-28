import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase/transactions-journey';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { CommonModule } from '@angular/common';
import { Environment, ENVIRONMENT_CONFIG } from '@backbase/shared/util/config';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';

@NgModule({
  imports: [
    CommonModule,
    TransactionsJourneyModule.forRoot({
      extensionSlots: {
        transactionItemAdditionalDetails:
          TransactionItemAdditionalDetailsComponent,
      },
    }),
  ],
  declarations: [TransactionItemAdditionalDetailsComponent],
  providers: [
    {
      provide: TransactionsJourneyConfiguration,
      useFactory: (
        environment: Environment
      ): TransactionsJourneyConfiguration => ({
        pageSize: 10,
        slimMode: environment.common.designSlimMode,
      }),
      deps: [ENVIRONMENT_CONFIG],
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,
    },
  ],
})
export class TransactionsJourneyBundleModule {}
