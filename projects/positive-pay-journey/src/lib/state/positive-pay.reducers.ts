/** Reducers for Positive Pay feature state */
import { accountsReducer } from './accounts/accounts.reducers';
import { positivePayChecksReducer } from './positive-pay-checks/positive-pay-checks.reducers';

export const positivePayReducers = {
  /** Reducer for accounts with all Positive Pay subscriptions. */
  accounts: accountsReducer,
  /** Reducers for accounts without Reverse Positive Pay subscription. */
  enterCheckAccounts: accountsReducer,
  /** Reducers for Positive Pay Checks state. */
  positivePayChecks: positivePayChecksReducer,
};
