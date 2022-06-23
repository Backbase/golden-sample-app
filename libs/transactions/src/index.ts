export * from './lib/transactions-journey.component';
export * from './lib/directives/transaction-additional-details.directive';

export * from './lib/services/transactions-journey-config.service';
export * from './lib/transactions-journey.module';
export {
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from // don't export the private config injection token
'./lib/extensions';
export * from './lib/views/transactions-view/transactions-view.component';

export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from './lib/communication';