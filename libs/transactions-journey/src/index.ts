export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase/transactions-journey/internal/data-access';
export {
  // don't export the private config injection token
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from '@backbase/transactions-journey/internal/feature-transaction-view';
export {
  ArrangementsService,
  TransactionsRouteTitleResolverService,
  TransactionsHttpService,
} from '@backbase/transactions-journey/internal/data-access';

// Export new standalone APIs
export {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TransactionsJourneyConfig,
  TRANSACTIONS_JOURNEY_CONFIG,
} from './lib/transactions-journey';
