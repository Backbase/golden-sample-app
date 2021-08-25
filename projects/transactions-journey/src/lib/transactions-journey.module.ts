import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { TransactionsViewComponent } from './views/transactions-view/transactions-view.component';
import { AmountModule, InputTextModule } from '@backbase/ui-ang';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';
import { TextFilterComponent } from './components/text-filter/text-filter.component';
import { FilterTransactionsPipe } from './pipes/filter-transactions.pipe';

const defaultRoute: Route = {
  path: '',
  component: TransactionsViewComponent,
  data: {
    title: TRANSLATIONS.transactionsTitle,
  },
};

@NgModule({
  declarations: [TransactionsViewComponent, TransactionItemComponent, TextFilterComponent, FilterTransactionsPipe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AmountModule,
    InputTextModule,
  ],
})
export class TransactionsJourneyModule {

  static forRoot(data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransactionsJourneyModule> {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
