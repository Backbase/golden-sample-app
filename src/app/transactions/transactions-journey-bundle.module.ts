import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyConfigurationToken,
  TransactionsJourneyModule
} from 'transactions-journey';

@NgModule({
  imports: [TransactionsJourneyModule.forRoot()],
  providers: [{
    provide: TransactionsJourneyConfigurationToken,
    useValue: {
      pageSize: 10,
    } as TransactionsJourneyConfiguration
  }],
})
export class TransactionsJourneyBundleModule {
}
