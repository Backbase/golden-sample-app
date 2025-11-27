import { InjectionToken, Provider } from '@angular/core';
import { provideRoutes, Routes } from '@angular/router';
import { TRANSLATIONS } from '@backbase/transactions-journey/internal/shared-data';
import {
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
} from '@backbase/transactions-journey/internal/data-access';

export type TransactionsJourneyExtensionsConfig = Record<string, unknown>;
export const TRANSACTION_EXTENSIONS_CONFIG =
  new InjectionToken<TransactionsJourneyExtensionsConfig>(
    'TRANSACTION_EXTENSIONS_CONFIG',
    {
      providedIn: 'root',
      factory: () => ({}),
    }
  );

// Components are directly imported since the journey is lazy-loaded via loadChildren
import { TransactionsViewComponent } from '@backbase/transactions-journey/internal/feature-transaction-view';
import { TransactionDetailsComponent } from '@backbase/transactions-journey/internal/feature-transaction-details-view';

export const defaultTransactionsRoutes: Routes = [
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

export interface TransactionsJourneyConfig {
  routes?: Routes;
  extensionSlots?: TransactionsJourneyExtensionsConfig;
}

/**
 * Provides the default configuration for Transactions Journey.
 * For standalone applications, use provideTransactionsJourney() in app config.
 */
export function provideTransactionsJourney({
  routes,
  extensionSlots,
}: TransactionsJourneyConfig = {}): Provider[] {
  return [
    provideRoutes(routes || defaultTransactionsRoutes),
    {
      provide: TRANSACTION_EXTENSIONS_CONFIG,
      useValue: extensionSlots || {},
    },
    TransactionsJourneyConfiguration,
    TransactionsRouteTitleResolverService,
  ];
}
