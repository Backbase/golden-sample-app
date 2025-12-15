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
// ADR-011: Import EntitlementsGuard for route protection
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';

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

/**
 * Entitlements triplet for transactions access control.
 * RULE: Follow ADR-011 triplet format (Resource.Function.permission)
 */
const TRANSACTIONS_ENTITLEMENTS = {
  view: 'Transactions.Transactions.view',
} as const;

const defaultRoutes: Routes = [
  {
    path: '',
    component: TransactionsViewComponent,
    // ADR-011: Protect route with EntitlementsGuard
    canActivate: [EntitlementsGuard],
    data: {
      title: TRANSLATIONS.transactionsTitle,
      // ADR-011: Entitlements triplet for access control
      entitlements: TRANSACTIONS_ENTITLEMENTS.view,
      // ADR-011: Redirect to error page on unauthorized access
      redirectTo: '/error/403',
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: ':id',
    component: TransactionDetailsComponent,
    // ADR-011: Protect route with EntitlementsGuard
    canActivate: [EntitlementsGuard],
    data: {
      title: TRANSLATIONS.transactionDetailsTitle,
      // ADR-011: Entitlements triplet for access control
      entitlements: TRANSACTIONS_ENTITLEMENTS.view,
      // ADR-011: Redirect to error page on unauthorized access
      redirectTo: '/error/403',
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
