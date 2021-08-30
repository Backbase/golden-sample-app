import { NgModule } from '@angular/core';
import {
  TransactionsJourneyConfiguration,
  TransactionsJourneyModule
} from 'transactions-journey';

@NgModule({
  imports: [TransactionsJourneyModule.forRoot()],
  providers: [{
    provide: TransactionsJourneyConfiguration,
    useValue: {
      pageSize: 10,
    } as TransactionsJourneyConfiguration
  }],
})
export class TransactionsJourneyBundleModule {
}
