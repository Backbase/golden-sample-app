/**
 * Build-time configuration model for Positive Pay subscriptions that we support in our capability.
 * Model can be extended in order to provide additional subscriptions.
 */
export interface ArrangementSubscriptions {
  /** Additional subscription parameters can be added in this model. */
  [key: string]: string;
  /** Subscription parameter for arrangement where Payee is mandatory. */
  checksPositivePayWithPayeeMatch: string;
  /** Subscription parameter for arrangement where Payee is not mandatory. */
  checksPositivePayWithoutPayeeMatch: string;
  /** Subscription parameter for arrangement for which service will not allow to submit checks. */
  checksReversePositivePay: string;
}
