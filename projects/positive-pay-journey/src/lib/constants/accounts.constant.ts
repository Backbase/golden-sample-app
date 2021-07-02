import { ArrangementSubscriptions } from '../models/arrangement-subscriptions.model';

/**
 * Default configuration for arrangements subscriptions.
 *
 * @public
 */
export const defaultArrangementSubscriptionsConfig: ArrangementSubscriptions = {
  checksPositivePayWithPayeeMatch: 'checks-positive-pay-with-payee-match',
  checksPositivePayWithoutPayeeMatch: 'checks-positive-pay-without-payee-match',
  checksReversePositivePay: 'checks-reverse-positive-pay',
} as const;

/**
 * Required params in order to fetch arrangements
 *
 * @internal
 */
export const getAccountsRequiredParams = {
  businessFunction: 'Product Summary',
  resourceName: 'Product Summary',
  privilege: 'view',
  favoriteFirst: true,
  size: 1000,
} as const;
