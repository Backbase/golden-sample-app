import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoadingState } from '../../models/loading-state.model';
import { mapPositivePaySubmitError } from '../../helpers/error.helper';
import { PositivePayState } from '../../models/positive-pay-state.model';
import { PositivePayChecksState, PositivePaySubmitCheckViewModel } from '../../models/positive-pay-checks-state.model';

const selectPositivePayChecks = createFeatureSelector<PositivePayState, PositivePayChecksState>('positivePayChecks');

export const isPositivePaySubmitCheckLoading = createSelector(
  selectPositivePayChecks,
  (state) => state.submitCheckCallState === LoadingState.LOADING,
);
export const isPositivePaySubmitCheckDone = createSelector(
  selectPositivePayChecks,
  (state) => state.submitCheckCallState === LoadingState.LOADED,
);
export const selectPositivePaySubmitCheckError = createSelector(selectPositivePayChecks, (state) =>
  mapPositivePaySubmitError(state.submitCheckCallState),
);

export const selectSubmitPositivePayCheckViewModel = createSelector(
  isPositivePaySubmitCheckLoading,
  isPositivePaySubmitCheckDone,
  selectPositivePaySubmitCheckError,
  (isLoading, isDone, error) =>
    ({
      isLoading,
      isDone,
      error,
    } as PositivePaySubmitCheckViewModel),
);

export const selectPositivePayCheckList = createSelector(selectPositivePayChecks, (state) => state.checkList);

export const selectPositivePayCheckListTotalCount = createSelector(
  selectPositivePayChecks,
  (state) => state.checkListCount,
);

export const selectPositivePayChecksLoadingState = createSelector(selectPositivePayChecks, (state) =>
  !mapPositivePaySubmitError(state.checkListCallState) ? (state.checkListCallState as LoadingState) : LoadingState.IDLE,
);

export const selectPositivePayChecksError = createSelector(selectPositivePayChecks, (state) =>
  mapPositivePaySubmitError(state.checkListCallState),
);
