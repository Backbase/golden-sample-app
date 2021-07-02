import { ProductSummaryItem } from '@backbase/data-ang/arrangements';
import { GetArrangementsByBusinessFunctionRequestParams } from '@backbase/data-ang/arrangements';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingState } from './loading-state.model';

// exporting arrangement params as AccountsGetRequestParams
// will be useful to handle breaking changes from arrangement api
/** Type for arrangements request params. */
export type AccountsGetRequestParams = GetArrangementsByBusinessFunctionRequestParams;

/** State model for accounts/ */
export interface AccountsState {
  /** List of accounts. */
  entities: ProductSummaryItem[];
  /** Total accounts for current filter. */
  totalCount: number;
  /** Loading or error state for accounts. */
  callState: LoadingState | HttpErrorResponse;
}

/** Response from data service. */
export interface AccountsResponse {
  /** List of accounts. */
  accounts: ProductSummaryItem[];
  /** Total count of accounts on service. */
  totalCount: number;
}

/** Payload model for fetching accounts. */
export interface LoadAccountsPayload {
  /** Parameters passed to service. */
  params: AccountsGetRequestParams;
}

/** Payload model for successful loading of accounts. */
export interface LoadAccountsSuccessPayload {
  /** List of accounts. */
  accounts: ProductSummaryItem[];
  /** Total count of accounts on service. */
  totalCount: number;
  /** Additional options */
  options?: {
    /** Flag to determine should we append list of accounts to existing state */
    append: boolean;
  };
}

/** Payload model for failed loading of accounts */
export interface LoadAccountsFailurePayload {
  /** Error object returned from the service */
  error: HttpErrorResponse;
}

/**
 * View model with properties for accounts used in views.
 */
export interface AccountsVm {
  /** List of accounts. */
  accounts: ProductSummaryItem[];
  /** Flag showing if loading is in progress. */
  loading: boolean;
  /** Total number of accounts for current filter. */
  totalCount: number;
  /** Error returned by service during loading of accounts. */
  error: HttpErrorResponse | undefined;
}
