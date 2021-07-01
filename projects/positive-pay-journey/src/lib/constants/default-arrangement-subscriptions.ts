import {ArrangementSubscriptions} from '../models/arrangement-subscriptions.model';

export const defaultArrangementSubscriptionsConfig: ArrangementSubscriptions = {
  checksPositivePayWithPayeeMatch: 'checks-positive-pay-with-payee-match',
  checksPositivePayWithoutPayeeMatch: 'checks-positive-pay-without-payee-match',
  checksReversePositivePay: 'checks-reverse-positive-pay',
} as const;
