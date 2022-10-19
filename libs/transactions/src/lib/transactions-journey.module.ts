import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { AmountModule } from '@backbase/ui-ang/amount';
import { BadgeModule } from '@backbase/ui-ang/badge';

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
import { TransactionsJourneyConfiguration } from './services/transactions-journey-config.service';
import { TransactionsRouteTitleResolverService } from './services/transactions-route-title-resolver.service';
import { TransactionsHttpService } from './services/transactions.http.service';
import { TransactionsViewComponent } from './views/transactions-view/transactions-view.component';
import { TransactionDetailsComponent } from './views/transaction-details-view/transaction-details-view.component';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from './extensions';

const defaultRoutes: Routes = [
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
    path: ':id',
    component: TransactionDetailsComponent,
    data: {
      title: TRANSLATIONS.transactionDetailsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
];

export interface TransactionsJourneyModuleConfig {
  routes?: Routes;
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
    ButtonModule,
    IconModule,
    BadgeModule,
  ],
  providers: [
    TransactionsHttpService,
    TransactionsJourneyConfiguration,
    TransactionsRouteTitleResolverService,
  ],
})
export class TransactionsJourneyModule {
  static forRoot({
    routes,
    extensionSlots,
  }: TransactionsJourneyModuleConfig = {}): ModuleWithProviders<TransactionsJourneyModule> {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [
        provideRoutes(routes || defaultRoutes),
        {
          provide: TRANSACTION_EXTENSIONS_CONFIG,
          useValue: extensionSlots || {},
        },
      ],
    };
  }
}
