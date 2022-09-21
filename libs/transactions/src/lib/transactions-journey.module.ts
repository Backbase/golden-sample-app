import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { AmountModule } from '@backbase/ui-ang/amount';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
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
import { TransactionDetailsComponent } from './views/transaction-details/transaction-details.component';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from './extensions';

const defaultRoute: Route[] = [
  {
    path: '',
    component: TransactionsViewComponent,
    data: {
      title: TRANSLATIONS.transactionsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: 'transaction-details/:id',
    component: TransactionDetailsComponent,
  },
];

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
    TransactionDetailsComponent,
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
  exports: [TransactionDetailsComponent],
})
export class TransactionsJourneyModule {
  static forRoot({
    route,
    extensionSlots,
  }: TransactionsJourneyModuleConfig = {}): ModuleWithProviders<TransactionsJourneyModule> {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [
        provideRoutes([...(defaultRoute || route)]),
        {
          provide: TRANSACTION_EXTENSIONS_CONFIG,
          useValue: extensionSlots || {},
        },
      ],
    };
  }
}
