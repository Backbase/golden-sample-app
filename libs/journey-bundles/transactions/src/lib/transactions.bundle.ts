import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TransactionsJourneyExtensionsConfig,
  TransactionsRouteTitleResolverService,
  TransactionsHttpService,
} from '@backbase/transactions-journey';
import { withProviders } from '@backbase/foundation-ang/core';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';

// Extensions configuration
const extensionsConfig: Partial<TransactionsJourneyExtensionsConfig> = {
  transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
};

// Journey configuration
const journeyConfig = {
  pageSize: 10,
  slimMode: false,
};

// Default export for Angular lazy loading
export default transactionsJourney(
  withConfig(journeyConfig),
  withCommunicationService(JourneyCommunicationService),
  withExtensions(extensionsConfig),
  withProviders([
    TransactionsRouteTitleResolverService,
    TransactionsHttpService,
  ])
);
