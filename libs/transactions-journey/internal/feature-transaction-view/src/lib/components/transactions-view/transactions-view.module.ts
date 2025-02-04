import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BadgeModule } from '@backbase/ui-ang/badge';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';

import { TransactionsHttpService } from '@backbase-gsa/transactions-journey/internal/data-access';
import { TextFilterComponent } from '@backbase-gsa/transactions-journey/internal/ui';
import { FilterTransactionsPipe } from '@backbase-gsa/transactions-journey/internal/util';

import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { TransactionsViewComponent } from './transactions-view.component';
import { AmountModule } from '@backbase/ui-ang/amount';
import {
  TRANSACTIONS_JOURNEY_TRANSACTION_VIEW_TRANSLATIONS,
  TransactionsJourneyTransactionViewTranslations,
} from '../../../translations-catalog';

export {
  TRANSACTIONS_JOURNEY_TRANSACTION_VIEW_TRANSLATIONS,
  TransactionsJourneyTransactionViewTranslations,
};

@NgModule({
  declarations: [TransactionsViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    LoadingIndicatorModule,
    BadgeModule,
    AmountModule,
    TrackerModule,
    FilterTransactionsPipe,
    TextFilterComponent,
    TransactionItemComponent,
  ],
  providers: [
    TransactionsHttpService,
    {
      provide: TRANSACTIONS_JOURNEY_TRANSACTION_VIEW_TRANSLATIONS,
      useValue: {},
    },
  ],
  exports: [TransactionsViewComponent],
})
export class TransactionsViewModule {}
