import { InjectionToken } from '@angular/core';

/**
 * Configuration for the Transactions Journey
 */
export interface TransactionsJourneyConfig {
  /**
   * Page size for transactions list pagination
   */
  pageSize?: number;
  /**
   * Whether to enable slim mode (reduced title display)
   */
  slimMode?: boolean;
}

/**
 * Default configuration for the Transactions Journey
 */
export const defaultTransactionsJourneyConfig: TransactionsJourneyConfig = {
  pageSize: 10,
  slimMode: false,
};

/**
 * Injection token for the Transactions Journey configuration
 */
export const TRANSACTIONS_JOURNEY_CONFIG =
  new InjectionToken<TransactionsJourneyConfig>('transactions-journey-config');
