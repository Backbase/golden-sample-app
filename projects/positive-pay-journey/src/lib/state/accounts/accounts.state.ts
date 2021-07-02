/**
 * State model for accounts.
 */
import { AccountsState } from '../../models/accounts-state.model';
import { LoadingState } from '../../models/loading-state.model';

export const accountsInitialState: AccountsState = {
  entities: [],
  totalCount: 0,
  callState: LoadingState.IDLE,
};
