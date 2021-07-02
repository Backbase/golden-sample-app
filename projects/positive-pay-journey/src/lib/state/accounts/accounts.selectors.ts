import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PositivePayState } from '../../models/positive-pay-state.model';
import { AccountsState, AccountsVm } from '../../models/accounts-state.model';
import { LoadingState } from '../../models/loading-state.model';
import { mapGeneralError } from '../../helpers/error.helper';
import { ProductSummaryItem } from '@backbase/data-ang/arrangements';
import { HttpErrorResponse } from '@angular/common/http';

export const selectAccountsState = createFeatureSelector<PositivePayState, AccountsState>('accounts');

export const selectAccounts = createSelector(selectAccountsState, (state) => state.entities);

export const selectTotalAccountsCount = createSelector(selectAccountsState, (state) => state.totalCount);

export const selectAccountsLoading = createSelector(
  selectAccountsState,
  (state) => state.callState === LoadingState.LOADING,
);

export const selectAccountsError = createSelector(selectAccountsState, (state) => mapGeneralError(state.callState));

export const selectAccountsViewModel = createSelector(
  selectAccounts,
  selectTotalAccountsCount,
  selectAccountsLoading,
  selectAccountsError,
  (accounts: ProductSummaryItem[], totalCount: number, loading: boolean, error: HttpErrorResponse | undefined) =>
    ({ accounts, loading, totalCount, error } as AccountsVm),
);
