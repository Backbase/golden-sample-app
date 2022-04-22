import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  TRANSACTION_ADDITION_DETAILS
} from '@libs/transactions';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';

@NgModule({
  imports: [TransactionsJourneyModule.forRoot()],
  providers: [
    { 
      provide: TRANSACTION_ADDITION_DETAILS,
      useValue: TransactionItemAdditionalDetailsComponent
    },
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
