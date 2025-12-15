import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AmountModule } from '@backbase/ui-ang/amount';
import { BadgeModule } from '@backbase/ui-ang/badge';

import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { ButtonModule } from '@backbase/ui-ang/button';
import { IconModule } from '@backbase/ui-ang/icon';
import { TrackerModule } from '@backbase/foundation-ang/observability';

import { TextFilterComponent } from '@backbase-gsa/transactions-journey/internal/ui';

import { TRANSLATIONS } from '@backbase-gsa/transactions-journey/internal/shared-data';
import {
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
} from '@backbase-gsa/transactions-journey/internal/data-access';
import { TransactionDetailsComponent } from '@backbase-gsa/transactions-journey/internal/feature-transaction-details-view';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
  TransactionsViewComponent,
  TransactionsViewModule,
} from '@backbase-gsa/transactions-journey/internal/feature-transaction-view';
const defaultRoutes: Routes = [
  {
    path: '',
    component: TransactionsViewComponent,
    canActivate: [EntitlementsGuard],
    data: {
      title: TRANSLATIONS.transactionsTitle,
      entitlements: 'Transactions.Transactions.view',
      redirectTo: '/unauthorized',
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: ':id',
    component: TransactionDetailsComponent,
    canActivate: [EntitlementsGuard],
    data: {
      title: TRANSLATIONS.transactionDetailsTitle,
      entitlements: 'Transactions.Transactions.view',
      redirectTo: '/unauthorized',
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
];

interface TransactionsJourneyModuleConfig {
  routes?: Routes;
  extensionSlots?: TransactionsJourneyExtensionsConfig;
}

@NgModule({
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
    TransactionDetailsComponent,
    TransactionsViewModule,
    TrackerModule.forJourney({
      journeyName: 'transactions',
    }),
  ],
  providers: [
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
