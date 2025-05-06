export * from './lib/transactions-journey-shell.module';
export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase-gsa/transactions-journey/internal/data-access';
export {
  // don't export the private config injection token
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from '@backbase-gsa/transactions-journey/internal/feature-transaction-view';
export {
  TransactionsJourneyConfiguration,
  ArrangementsService,
} from '@backbase-gsa/transactions-journey/internal/data-access';

// Export new standalone APIs
export {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TransactionsJourneyConfig,
  TRANSACTIONS_JOURNEY_CONFIG,
} from './lib/transactions-journey';
