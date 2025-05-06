import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
} from '@backbase-gsa/transactions-journey';
import { JourneyCommunicationService } from '@backbase-gsa/shared/feature/communication';
import {
  Environment,
  ENVIRONMENT_CONFIG,
} from '@backbase-gsa/shared/util/config';
import { inject } from '@angular/core';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';

// Create the bundle using the standalone journey factory
export default transactionsJourney(
  // Journey configuration
  withConfig({
    pageSize: 10,
    slimMode: inject(ENVIRONMENT_CONFIG).common?.designSlimMode || false,
  }),
  // Communication service configuration
  withCommunicationService(JourneyCommunicationService),
  // Extensions configuration
  withExtensions({
    transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
  })
);
