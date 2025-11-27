import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
} from '@backbase/transactions-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { Routes } from '@angular/router';
import { TransactionsRouteTitleResolverService } from '@backbase/transactions-journey/internal/data-access';

// The actual routes that will be lazy-loaded
const routes: Routes = transactionsJourney(
  // Journey configuration - using a factory function that will be called at runtime
  withConfig({
    pageSize: 10,
    slimMode: false,
  }),
  // Communication service configuration
  withCommunicationService(JourneyCommunicationService),
  // Extensions configuration
  withExtensions({
    transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
  })
);

// Default export for Angular lazy loading
export default routes;

// Named export for backward compatibility (can be removed in future refactor)
export const TRANSACTIONS_ROUTES = routes;

export const TRANSACTIONS_PROVIDERS = [
  TransactionsRouteTitleResolverService,
  // Extension configuration is handled by withExtensions() in the routes above
];
