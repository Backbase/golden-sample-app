import { Provider } from '@angular/core';
import { provideRoutes, Routes } from '@angular/router';
import { TRANSLATIONS } from '@backbase/transactions-journey/internal/shared-data';
import {
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
} from '@backbase/transactions-journey/internal/data-access';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from '@backbase/transactions-journey/internal/feature-transaction-view';

export const defaultTransactionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '@backbase/transactions-journey/internal/feature-transaction-view'
      ).then((m) => m.TransactionsViewComponent),
    data: {
      title: TRANSLATIONS.transactionsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        '@backbase/transactions-journey/internal/feature-transaction-details-view'
      ).then((m) => m.TransactionDetailsComponent),
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
