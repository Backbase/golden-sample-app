import { LoadingState } from '../models/loading-state.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PositivePayCallState } from '../models/positive-pay-checks.models';
import { PositivePayErrorResponse } from '../models/positive-pay-error-response.model';

export const mapGeneralError = (callState: LoadingState | HttpErrorResponse): HttpErrorResponse | undefined =>
  callState instanceof HttpErrorResponse ? callState : undefined;

export const mapPositivePaySubmitError = (callState: PositivePayCallState) =>
  callState instanceof PositivePayErrorResponse ? callState : undefined;
