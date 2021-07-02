import { PositivePayState } from '../models/positive-pay-state.model';
import { accountsInitialState } from './accounts/accounts.state';
import { positivePayChecksInitialState } from './positive-pay-checks/positive-pay-checks.state';

export const POSITIVE_PAY_STATE_FEATURE_KEY = 'positivePayStateFeatureKey';

/**
 * State object for Positive Pay Checks journey.
 */
export const positivePayInitialState: PositivePayState = {
  /** Sub-state for accounts with all Positive Pay subscriptions. */
  accounts: accountsInitialState,
  /** Sub-state for accounts without Reverse Positive Pay subscription. */
  enterCheckAccounts: accountsInitialState,
  /** Sub-state for Positive Pay Checks state. */
  positivePayChecks: positivePayChecksInitialState,
};
