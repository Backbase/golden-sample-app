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

// Extensions configuration
const extensionsConfig: Partial<TransactionsJourneyExtensionsConfig> = {
  transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
};

// Journey configuration
const journeyConfig = {
  pageSize: 10,
  slimMode: false,
};

// Providers needed by the journey's internal services
// Note: TransactionsJourneyConfiguration is an @Injectable class used by internal services
// (TransactionsHttpService, TransactionsRouteTitleResolverService), which is different from
// the TRANSACTIONS_JOURNEY_CONFIG InjectionToken provided by withConfig().
const journeyProviders = [
  {
    provide: TransactionsJourneyConfiguration,
    useValue: journeyConfig,
  },
  TransactionsRouteTitleResolverService,
  {
    provide: TRANSACTION_EXTENSIONS_CONFIG,
    useValue: extensionsConfig,
  },
];

// Build the journey routes with providers attached
const journeyRoutes: Routes = transactionsJourney(
  withConfig(journeyConfig),
  withCommunicationService(JourneyCommunicationService),
  withExtensions(extensionsConfig)
);

// Create wrapper route that includes the required providers
// This ensures providers are available when the journey is lazy-loaded
const routes: Routes = [
  {
    path: '',
    providers: journeyProviders,
    children: journeyRoutes,
  },
];

// Default export for Angular lazy loading
export default routes;

// Named export for backward compatibility (can be removed in future refactor)
export const TRANSACTIONS_ROUTES = routes;
