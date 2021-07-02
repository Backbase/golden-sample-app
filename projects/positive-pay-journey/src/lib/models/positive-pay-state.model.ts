import { AccountsState } from './accounts-state.model';
import { PositivePayChecksState } from './positive-pay-checks-state.model';

export interface PositivePayState {
  accounts: AccountsState;
  enterCheckAccounts: AccountsState;
  positivePayChecks: PositivePayChecksState;
}
