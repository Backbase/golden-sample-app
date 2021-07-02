import { LoadingState } from './loading-state.model';
import { PositivePayErrorResponse } from './positive-pay-error-response.model';
import { FilterChecksRequestParams, PositivePayCheckList } from '@backbase/data-ang/positive-pay-v1';

export type PositivePayCallState = LoadingState | PositivePayErrorResponse;

/**
 * Additional parameters passed to store when requesting data from service.
 *
 * @internal
 */
export interface AdditionalParams {
  /** Should received data be appended to the current list. */
  append?: boolean;
  /** Loading state of the request. */
  loadingState?: LoadingState;
}

export interface PositivePayCheckListModel extends PositivePayCheckList {
  count: number;
  additionalParams?: AdditionalParams;
}

/**
 * Model for additional parameters required for store when fetching list of checks.
 *
 * @internal
 */
export interface PositivePayFilterChecksParams extends FilterChecksRequestParams {
  /** Additional parameters used in store. */
  additionalParams?: AdditionalParams;
}
