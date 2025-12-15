import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BadgeModule } from '@backbase/ui-ang/badge';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
// ADR-006: Import AccountSelectorModule from design system
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
// ADR-006: Import EmptyStateModule for no transactions state
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';

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
    LoadingIndicatorModule,
    BadgeModule,
    AmountModule,
    TrackerModule,
    FilterTransactionsPipe,
    TextFilterComponent,
    TransactionItemComponent,
    // ADR-006: Account selector from design system
    AccountSelectorModule,
    // ADR-006: Empty state for no transactions
    EmptyStateModule,
  ],
  providers: [TransactionsHttpService],
  exports: [TransactionsViewComponent],
})
export class TransactionsViewModule {}
