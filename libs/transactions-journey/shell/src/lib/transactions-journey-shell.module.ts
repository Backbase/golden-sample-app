import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { AmountModule } from '@backbase/ui-ang/amount';
import { BadgeModule } from '@backbase/ui-ang/badge';

import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { ButtonModule } from '@backbase/ui-ang/button';
import { IconModule } from '@backbase/ui-ang/icon';
import { TrackerModule } from '@backbase/foundation-ang/observability';

import { TextFilterComponent } from '@backbase-gsa/internal-transactions-ui';
import {
  TransactionItemComponent,
  TransactionItemAdditionalDetailsDirective,
} from './components/transaction-item/transaction-item.component';
import { TRANSLATIONS } from './config/constants/dynamic-translations';
import { FilterTransactionsPipe } from '@backbase-gsa/internal-transactions-util';
import { TransactionsJourneyConfiguration } from '@backbase-gsa/internal-transactions-data-access';
import { TransactionsRouteTitleResolverService } from '@backbase-gsa/internal-transactions-data-access';
import { TransactionsHttpService } from '@backbase-gsa/internal-transactions-data-access';
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
    FilterTransactionsPipe,
    TransactionItemAdditionalDetailsDirective,
    TransactionDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AmountModule,
    LoadingIndicatorModule,
    ButtonModule,
    IconModule,
    BadgeModule,
    TextFilterComponent,
    TrackerModule.forJourney({
      journeyName: 'transactions',
    }),
  ],
  providers: [
    TransactionsHttpService,
    TransactionsJourneyConfiguration,
    TransactionsRouteTitleResolverService,
  ],
})
export class TransactionsJourneyShellModule {
  static forRoot({
    routes,
    extensionSlots,
  }: TransactionsJourneyModuleConfig = {}): ModuleWithProviders<TransactionsJourneyShellModule> {
    return {
      ngModule: TransactionsJourneyShellModule,
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
