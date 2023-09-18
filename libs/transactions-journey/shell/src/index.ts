export * from './lib/transactions-journey-shell.module';
export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase-gsa/internal-transactions-data-access';
export {
  // don't export the private config injection token
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from 'libs/transactions-journey/feature-transaction-view/src';
export {
  TransactionsJourneyConfiguration,
  ArrangementsService,
} from '@backbase-gsa/internal-transactions-data-access';
