import { PositivePayChecksState } from '../../models/positive-pay-checks-state.model';
import { LoadingState } from '../../models/loading-state.model';

export const positivePayChecksInitialState: PositivePayChecksState = {
  checkList: { checks: [] },
  checkListCallState: LoadingState.IDLE,
  submitCheckCallState: LoadingState.IDLE,
  checkListCount: 0,
};
