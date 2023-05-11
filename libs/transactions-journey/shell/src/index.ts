export * from './lib/transactions-journey-shell.module';
export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from './lib/services/communication';
export {
  // don't export the private config injection token
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from './lib/extensions';
export {
  TransactionsJourneyConfiguration,
  ArrangementsService,
} from '@backbase-gsa/internal-transactions-data-access';
