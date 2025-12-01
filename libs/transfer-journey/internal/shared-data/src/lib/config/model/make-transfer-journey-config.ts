import { InjectionToken } from '@angular/core';

/**
 * Configuration for the Make Transfer Journey
 */
export interface MakeTransferJourneyConfig {
  /**
   * Maximum transaction amount allowed per transfer
   */
  maxTransactionAmount?: number;
  /**
   * Whether to show mask indicator on account numbers
   */
  maskIndicator?: boolean;
  /**
   * Whether to enable slim mode (reduced title display)
   */
  slimMode?: boolean;
}

/**
 * Default configuration for the Make Transfer Journey
 */
export const defaultMakeTransferJourneyConfig: MakeTransferJourneyConfig = {
  maxTransactionAmount: 1000000,
  maskIndicator: true,
  slimMode: false,
};

/**
 * Injection token for the Make Transfer Journey configuration
 */
export const MAKE_TRANSFER_JOURNEY_CONFIG =
  new InjectionToken<MakeTransferJourneyConfig>('make-transfer-journey-config');

