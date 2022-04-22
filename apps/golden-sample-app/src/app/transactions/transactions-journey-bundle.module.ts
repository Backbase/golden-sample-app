import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@libs/transactions';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';
import { TransactionsJourneyBundleComponent } from './transactions-journey-bundle.component';

@NgModule({
  imports: [
    CommonModule,
    TransactionsJourneyModule.forRoot({ 
      route: {
        path: '',
        component: TransactionsJourneyBundleComponent
      } 
    })
  ],
  declarations: [TransactionsJourneyBundleComponent],
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
