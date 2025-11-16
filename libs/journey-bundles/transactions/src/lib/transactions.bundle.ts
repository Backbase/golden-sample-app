import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TRANSACTIONS_JOURNEY_CONFIG,
} from '@backbase/transactions-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';
import { Injectable, inject } from '@angular/core';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { Routes } from '@angular/router';
import {
  TransactionsRouteTitleResolverService,
  TransactionsJourneyConfiguration,
} from '@backbase/transactions-journey/internal/data-access';
import { TRANSACTION_EXTENSIONS_CONFIG } from '@backbase/transactions-journey/internal/feature-transaction-view';

// Create a service that will be used to configure the journey
@Injectable()
export class TransactionsConfigService {
  readonly #slimMode =
    inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ?? false;

  getJourneyConfig() {
    return {
      pageSize: 10,
      slimMode: this.#slimMode,
    };
  }
}

// The actual routes that will be lazy-loaded
export const TRANSACTIONS_ROUTES: Routes = transactionsJourney(
  // Journey configuration - using a factory function that will be called at runtime
  withConfig({
    pageSize: 10,
    slimMode: false, // Default value, will be updated by the module
  }),
  // Communication service configuration
  withCommunicationService(JourneyCommunicationService),
  // Extensions configuration
  withExtensions({
    transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
  })
);

export const TRANSACTIONS_PROVIDERS = [
  TransactionsConfigService,
  TransactionsRouteTitleResolverService,
  {
    provide: TransactionsJourneyConfiguration,
    useFactory: (configService: TransactionsConfigService) => {
      const config = configService.getJourneyConfig();
      const journeyConfig = new TransactionsJourneyConfiguration();
      journeyConfig.pageSize = config.pageSize;
      journeyConfig.slimMode = config.slimMode;
      return journeyConfig;
    },
    deps: [TransactionsConfigService],
  },
  {
    provide: TRANSACTIONS_JOURNEY_CONFIG,
    useFactory: (configService: TransactionsConfigService) => {
      return configService.getJourneyConfig();
    },
    deps: [TransactionsConfigService],
  },
  {
    provide: TRANSACTION_EXTENSIONS_CONFIG,
    useValue: {
      transactionItemAdditionalDetails:
        TransactionItemAdditionalDetailsComponent,
    },
  },
];
