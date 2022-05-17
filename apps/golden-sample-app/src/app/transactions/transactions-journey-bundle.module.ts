import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@libs/transactions';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';

@NgModule({
  imports: [TransactionsJourneyModule.forRoot({
    extensionSlots: {
      // Provide the custom component in a type-safe way via config
      transactionItem: TransactionItemAdditionalDetailsComponent
    }
  })],
  declarations: [TransactionItemAdditionalDetailsComponent],
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
