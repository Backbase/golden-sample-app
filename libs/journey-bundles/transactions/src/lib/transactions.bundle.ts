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
// Note: withConfig() provides TRANSACTIONS_JOURNEY_CONFIG (InjectionToken)
// We also need to provide TransactionsJourneyConfiguration (class) for internal services
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
export default transactionsJourney(
  withConfig(journeyConfig),
  withCommunicationService(JourneyCommunicationService),
  withExtensions(extensionsConfig),
  withProviders(journeyProviders)
);
