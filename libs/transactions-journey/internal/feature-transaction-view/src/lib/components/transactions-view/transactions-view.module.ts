import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { BadgeModule } from '@backbase/ui-ang/badge';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { TrackerModule } from '@backbase/foundation-ang/observability';

import { TransactionsHttpService } from '@backbase-gsa/transactions-journey/internal/data-access';
import { TextFilterComponent } from '@backbase-gsa/transactions-journey/internal/ui';
import { FilterTransactionsPipe } from '@backbase-gsa/transactions-journey/internal/util';

import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { TransactionsViewComponent } from './transactions-view.component';
import { AmountModule } from '@backbase/ui-ang/amount';

@NgModule({
  declarations: [TransactionsViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    AccountSelectorModule,
    AmountModule,
    BadgeModule,
    EmptyStateModule,
    LoadingIndicatorModule,
    TrackerModule,
    FilterTransactionsPipe,
    TextFilterComponent,
    TransactionItemComponent,
  ],
  providers: [TransactionsHttpService],
  exports: [TransactionsViewComponent],
})
export class TransactionsViewModule {}
