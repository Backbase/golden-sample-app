export * from './lib/services/transactions-journey-config.service';
export * from './lib/transactions-journey.module';
export {
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  // don't export the private config injection token
} from './lib/extensions';
export * from './lib/views/transactions-view/transactions-view.component';

export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from './lib/communication';

export * from './lib/extension-slot.directive';
