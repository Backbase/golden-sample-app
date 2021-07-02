import { createAction, props } from '@ngrx/store';
import { PositivePayCheck, PositivePayCheckPost } from '@backbase/data-ang/positive-pay-v1';
import { PositivePayErrorResponse } from '../../models/positive-pay-error-response.model';
import { PositivePayCheckListModel, PositivePayFilterChecksParams } from '../../models/positive-pay-checks.models';

export const submitPositivePayCheck = createAction(
  '[New Check Form] Submit Check',
  props<{ payload: PositivePayCheckPost }>(),
);

export const positivePayCheckSubmitted = createAction(
  '[Positive Pay Checks API] Check Submitted',
  props<{ payload: PositivePayCheck }>(),
);

export const positivePayCheckSubmitFailed = createAction(
  '[Positive Pay Checks API] Check Submit Failed',
  props<{ error: PositivePayErrorResponse }>(),
);

export const resetPositivePayCheckLoadingState = createAction('[Positive Pay Journey] Reset Check Loading State');

export const getPositivePayCheckList = createAction(
  '[Positive Pay View Checks View] Get Check List',
  props<PositivePayFilterChecksParams>(),
);

export const positivePayCheckListLoaded = createAction(
  '[Positive Pay Checks API] Check List Loaded Successfully',
  props<PositivePayCheckListModel>(),
);

export const positivePayCheckListLoadingFailed = createAction(
  '[Positive Pay Checks API] Check List Loading Failed',
  props<{ error: PositivePayErrorResponse }>(),
);
