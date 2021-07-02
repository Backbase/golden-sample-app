import { PositivePayCheckList } from '@backbase/data-ang/positive-pay-v1';
import { PositivePayCallState } from './positive-pay-checks.models';
import { PositivePayErrorResponse } from './positive-pay-error-response.model';

export interface PositivePayChecksState {
  checkList: PositivePayCheckList;
  checkListCallState: PositivePayCallState;
  submitCheckCallState: PositivePayCallState;
  checkListCount: number;
}

export interface PositivePaySubmitCheckViewModel {
  isLoading: boolean;
  isDone: boolean;
  error: PositivePayErrorResponse | undefined;
}
