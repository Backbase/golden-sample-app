import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@libs/transactions';
import { environment } from '../../environments/environment';
import { JourneyCommunicationService } from '../services/journey-communication.service';

@Component({
  selector: 'app-transactions-journey-bundle',
  template: `
    <bb-transactions-journey>
        <ng-template bbTransactionAdditionalDetails let-transaction>
          {{ transaction.counterPartyAccountNumber}}
        </ng-template>
    </bb-transactions-journey>
  `,
})
export class TransactionsJourneyBundleComponent { }

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
