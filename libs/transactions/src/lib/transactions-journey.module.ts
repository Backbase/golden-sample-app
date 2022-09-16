import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';

import { AmountModule } from '@backbase/ui-ang/amount';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { ButtonModule } from '@backbase/ui-ang/button';
import { IconModule } from '@backbase/ui-ang/icon';

import { TextFilterComponent } from './components/text-filter/text-filter.component';
import {
  TransactionItemComponent,
  TransactionItemAdditionalDetailsDirective,
} from './components/transaction-item/transaction-item.component';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { FilterTransactionsPipe } from './pipes/filter-transactions.pipe';
import { ArrangementsService } from './services/arrangements.service';
import { TransactionsJourneyConfiguration } from './services/transactions-journey-config.service';
import { TransactionsRouteTitleResolverService } from './services/transactions-route-title-resolver.service';
import { TransactionsHttpService } from './services/transactions.http.service';
import { TransactionsViewComponent } from './views/transactions-view/transactions-view.component';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from './extensions';

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

export interface TransactionsJourneyModuleConfig {
  route?: Route;
  extensionSlots?: TransactionsJourneyExtensionsConfig;
}

@NgModule({
  declarations: [
    TransactionsViewComponent,
    TransactionItemComponent,
    TextFilterComponent,
    FilterTransactionsPipe,
    TransactionItemAdditionalDetailsDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AmountModule,
    InputTextModule,
    LoadingIndicatorModule,
    ButtonModule,
    IconModule,
  ],
  providers: [
    TransactionsHttpService,
    TransactionsJourneyConfiguration,
    ArrangementsService,
    TransactionsRouteTitleResolverService,
  ],
})
export class TransactionsJourneyModule {
  static forRoot({
    route,
    extensionSlots,
  }: TransactionsJourneyModuleConfig = {}): ModuleWithProviders<TransactionsJourneyModule> {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [
        provideRoutes([route || defaultRoute]),
        {
          provide: TRANSACTION_EXTENSIONS_CONFIG,
          useValue: extensionSlots || {},
        },
      ],
    };
  }
}
