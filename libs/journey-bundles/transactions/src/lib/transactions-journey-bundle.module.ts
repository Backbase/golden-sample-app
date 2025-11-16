import { inject, NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase/transactions-journey';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { CommonModule } from '@angular/common';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';
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
    TransactionItemAdditionalDetailsComponent,
  ],
  providers: [
    {
      provide: TransactionsJourneyConfiguration,
      useFactory: (): TransactionsJourneyConfiguration => ({
        pageSize: 10,
        slimMode:
          inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ??
          false,
      }),
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,
    },
  ],
})
export class TransactionsJourneyBundleModule {}
