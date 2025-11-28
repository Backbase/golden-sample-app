import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TransactionsJourneyExtensionsConfig,
} from '@backbase/transactions-journey';
import { withProviders } from '@backbase/foundation-ang/core';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
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

// Default export for Angular lazy loading
// Use withProviders to attach providers directly to the journey configuration
export default transactionsJourney(
  withConfig(journeyConfig),
  withCommunicationService(JourneyCommunicationService),
  withExtensions(extensionsConfig),
  withProviders(journeyProviders)
);
