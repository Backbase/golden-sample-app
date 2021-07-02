import { Action, createReducer, on } from '@ngrx/store';
import { accountsInitialState } from './accounts.state';
import { accountsLoaded, accountsLoadFailed, loadAccounts } from './accounts.actions';
import { LoadingState } from '../../models/loading-state.model';
import { appendAccounts } from '../../helpers/account.helper';
import { AccountsState } from '../../models/accounts-state.model';

const reducer = createReducer(
  accountsInitialState,
  on(loadAccounts, (state) => ({
    ...state,
    callState: LoadingState.LOADING,
  })),
  on(accountsLoaded, (state, { accounts, totalCount, options }) => ({
    ...state,
    entities: appendAccounts(state.entities, accounts, !!options?.append),
    totalCount,
    callState: LoadingState.IDLE,
  })),
  on(accountsLoadFailed, (state, action) => ({
    ...state,
    entities: [],
    totalCount: 0,
    callState: action.error,
  })),
);

/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function accountsReducer(state: AccountsState | undefined, action: Action) {
  return reducer(state, action);
}
/* eslint-enable prefer-arrow/prefer-arrow-functions */
