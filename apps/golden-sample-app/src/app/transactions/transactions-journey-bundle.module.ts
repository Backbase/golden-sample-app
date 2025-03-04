import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase-gsa/transactions-journey';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    TransactionItemAdditionalDetailsComponent,
    TransactionsJourneyModule.forRoot({
      extensionSlots: {
        transactionItemAdditionalDetails:
          TransactionItemAdditionalDetailsComponent,
      },
    }),
  ],
  providers: [
    {
      provide: TransactionsJourneyConfiguration,
      useValue: {
        pageSize: 10,
        slimMode: environment.common.designSlimMode,
      } as TransactionsJourneyConfiguration,
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,
    },
  ],
})
export class TransactionsJourneyBundleModule {}
