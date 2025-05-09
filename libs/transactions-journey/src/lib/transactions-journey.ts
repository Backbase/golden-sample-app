import { InjectionToken, Provider, Type } from '@angular/core';
import { journeyFactory } from '@backbase/foundation-ang/core';
import { Routes } from '@angular/router';
import { TransactionsViewComponent } from '@backbase-gsa/transactions-journey/internal/feature-transaction-view';
import { TransactionDetailsComponent } from '@backbase-gsa/transactions-journey/internal/feature-transaction-details-view';
import { TransactionsRouteTitleResolverService } from '@backbase-gsa/transactions-journey/internal/data-access';
import { TRANSLATIONS } from '@backbase-gsa/transactions-journey/internal/shared-data';
import {
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  TransactionsCommunicationService,
} from '@backbase-gsa/transactions-journey/internal/data-access';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from '@backbase-gsa/transactions-journey/internal/feature-transaction-view';

// Configuration Interface
export interface TransactionsJourneyConfig {
  pageSize: number;
  slimMode: boolean;
}

// Default Configuration
const defaultConfig: TransactionsJourneyConfig = {
  pageSize: 20,
  slimMode: true,
};

// Default Extensions Configuration
const defaultExtensionsConfig: TransactionsJourneyExtensionsConfig = {};

// Configuration Token
export const TRANSACTIONS_JOURNEY_CONFIG =
  new InjectionToken<TransactionsJourneyConfig>('TRANSACTIONS_JOURNEY_CONFIG', {
    providedIn: 'root',
    factory: () => defaultConfig,
  });

// Default Routes
const defaultRoutes: Routes = [
  {
    path: '',
    component: TransactionsViewComponent,
    data: {
      title: TRANSLATIONS.transactionsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: ':id',
    component: TransactionDetailsComponent,
    data: {
      title: TRANSLATIONS.transactionDetailsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
];

// Journey Factory
export const {
  transactionsJourney,
  withConfig: withFullConfig,
  withCommunicationService: withFullCommunicationService,
  withExtensions: withFullExtensions,
} = journeyFactory({
  journeyName: 'transactionsJourney',
  defaultRoutes,
  tokens: {
    config: TRANSACTIONS_JOURNEY_CONFIG,
    communicationService: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
    extensions: TRANSACTION_EXTENSIONS_CONFIG,
  },
});

// Helper Functions - use correct typing for the provider factory functions
export const withConfig = (config: Partial<TransactionsJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });

export const withCommunicationService = (
  service: Type<TransactionsCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });

export const withExtensions = (
  extensions: Partial<TransactionsJourneyExtensionsConfig>
) =>
  withFullExtensions({
    useValue: {
      ...defaultExtensionsConfig,
      ...extensions,
    },
  });
