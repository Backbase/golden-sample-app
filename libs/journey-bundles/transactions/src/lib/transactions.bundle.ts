import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TransactionsJourneyExtensionsConfig,
} from '@backbase/transactions-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { Routes } from '@angular/router';
import {
  TransactionsRouteTitleResolverService,
  TransactionsJourneyConfiguration,
} from '@backbase/transactions-journey/internal/data-access';
import { TRANSACTION_EXTENSIONS_CONFIG } from '@backbase/transactions-journey/internal/feature-transaction-view';

// Extensions configuration - shared between routes and providers
const extensionsConfig: Partial<TransactionsJourneyExtensionsConfig> = {
  transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
};

// The actual routes that will be lazy-loaded
const routes: Routes = transactionsJourney(
  // Journey configuration - using a factory function that will be called at runtime
  withConfig({
    pageSize: 10,
    slimMode: false,
  }),
  // Communication service configuration
  withCommunicationService(JourneyCommunicationService),
  // Extensions configuration
  withExtensions(extensionsConfig)
);

// Default export for Angular lazy loading
export default routes;

// Named export for backward compatibility (can be removed in future refactor)
export const TRANSACTIONS_ROUTES = routes;

export const TRANSACTIONS_PROVIDERS = [
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
  {
    provide: TRANSACTION_EXTENSIONS_CONFIG,
    useValue: extensionsConfig,
  },
];
