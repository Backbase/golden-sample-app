import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { AmountModule } from '@backbase/ui-ang/amount';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { TextFilterComponent } from './components/text-filter/text-filter.component';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { FilterTransactionsPipe } from './pipes/filter-transactions.pipe';
import { ArrangementsService } from './services/arrangements.service';
import { TransactionsJourneyConfiguration } from './services/transactions-journey-config.service';
import { TransactionsRouteTitleResolverService } from './services/transactions-route-title-resolver.service';
import { TransactionsHttpService } from './services/transactions.http.service';
import { TransactionsViewComponent } from './views/transactions-view/transactions-view.component';

const defaultRoute: Route = {
  path: '',
  component: TransactionsViewComponent,
  data: {
    title: TRANSLATIONS.transactionsTitle,
  },
  resolve: {
    title: TransactionsRouteTitleResolverService,
  },
};

@NgModule({
  declarations: [
    TransactionsViewComponent,
    TransactionItemComponent,
    TextFilterComponent,
    FilterTransactionsPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AmountModule,
    InputTextModule,
    LoadingIndicatorModule,
  ],
  providers: [
    TransactionsHttpService,
    TransactionsJourneyConfiguration,
    ArrangementsService,
    TransactionsRouteTitleResolverService,
  ],
})
export class TransactionsJourneyModule {
  static forRoot(
    data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransactionsJourneyModule> {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
