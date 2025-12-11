import { Type } from '@angular/core';
import { journeyFactory, withDefaults } from '@backbase/foundation-ang/core';
import { Routes } from '@angular/router';
import { TransactionsRouteTitleResolverService } from '@backbase/transactions-journey/internal/data-access';
import {
  TRANSLATIONS,
  TRANSACTIONS_JOURNEY_CONFIG,
  TransactionsJourneyConfig,
  defaultTransactionsJourneyConfig,
} from '@backbase/transactions-journey/internal/shared-data';
import {
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  TransactionsCommunicationService,
} from '@backbase/transactions-journey/internal/data-access';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from '@backbase/transactions-journey/internal/feature-transaction-view';

// Default Routes
// Components are directly imported since the entire journey is lazy-loaded via loadChildren
import { TransactionsViewComponent } from '@backbase/transactions-journey/internal/feature-transaction-view';
import { TransactionDetailsComponent } from '@backbase/transactions-journey/internal/feature-transaction-details-view';

// Re-export config types for public API
export { TransactionsJourneyConfig, TRANSACTIONS_JOURNEY_CONFIG };

// Default Extensions Configuration
const defaultExtensionsConfig: TransactionsJourneyExtensionsConfig = {};

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

// Journey Factory
export const {
  transactionsJourney,
  withConfig,
  withCommunicationService: withFullCommunicationService,
  withExtensions: withFullExtensions,
} = journeyFactory({
  journeyName: 'transactionsJourney',
  defaultRoutes,
  tokens: {
    config: withDefaults(
      TRANSACTIONS_JOURNEY_CONFIG,
      defaultTransactionsJourneyConfig
    ),
    communicationService: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
    extensions: TRANSACTION_EXTENSIONS_CONFIG,
  },
});

// Helper Functions - use correct typing for the provider factory functions
export const withCommunicationService = (
  service: Type<TransactionsCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });

export const withExtensions = (
  extensions: Partial<TransactionsJourneyExtensionsConfig>
) =>
  withFullExtensions({
    useValue: {
      ...defaultExtensionsConfig,
      ...extensions,
    },
  });
