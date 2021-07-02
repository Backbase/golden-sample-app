import { LoadingState } from '../../models/loading-state.model';
import { PositivePayCheckListModel, PositivePayFilterChecksParams } from '../../models/positive-pay-checks.models';
import { positivePayChecksInitialState } from './positive-pay-checks.state';
import { Action, createReducer, on } from '@ngrx/store';
import { PositivePayChecksState } from '../../models/positive-pay-checks-state.model';
import * as actions from './positive-pay-checks.actions';

const getLoadingState = (action: PositivePayFilterChecksParams): LoadingState => {
  if (action.additionalParams) {
    const { loadingState = LoadingState.LOADING } = action.additionalParams;
    return loadingState;
  }
  return LoadingState.LOADING;
};

const getChecks = (state: PositivePayChecksState, action: PositivePayCheckListModel) => {
  if (action.additionalParams) {
    const { append = false } = action.additionalParams;
    return append ? [...state.checkList.checks, ...action.checks] : action.checks;
  }
  return action.checks;
};

export const reducer = createReducer(
  positivePayChecksInitialState,
  on(actions.submitPositivePayCheck, (state) => ({
    ...state,
    submitCheckCallState: LoadingState.LOADING,
  })),
  on(actions.positivePayCheckSubmitted, (state) => ({
    ...state,
    submitCheckCallState: LoadingState.LOADED,
  })),
  on(actions.positivePayCheckSubmitFailed, (state, action) => ({
    ...state,
    submitCheckCallState: action.error,
  })),
  on(actions.resetPositivePayCheckLoadingState, (state) => ({
    ...state,
    submitCheckCallState: LoadingState.IDLE,
  })),
  on(actions.getPositivePayCheckList, (state, action) => ({
    ...state,
    checkListCallState: getLoadingState(action),
  })),
  on(actions.positivePayCheckListLoaded, (state, action) => ({
    ...state,
    checkList: { ...state.checkList, checks: getChecks(state, action) },
    checkListCount: action.count,
    checkListCallState: LoadingState.IDLE,
  })),
  on(actions.positivePayCheckListLoadingFailed, (state, action) => ({
    ...state,
    checkListCallState: action.error,
  })),
);

/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function positivePayChecksReducer(state: PositivePayChecksState | undefined, action: Action) {
  return reducer(state, action);
}
/* eslint-enable prefer-arrow/prefer-arrow-functions */
