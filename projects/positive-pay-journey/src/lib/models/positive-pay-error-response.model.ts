import { HttpErrorResponse } from '@angular/common/http';
import { ErrorItem } from '@backbase/data-ang/positive-pay-v1';

/**
 * Model for error response returned by the service.
 */
export class PositivePayErrorResponse {
  /** Status code of the service error */
  statusCode: number;
  /** List of errors returned from service. */
  errors: ErrorItem[] = [];

  /**
   * @param response
   */
  constructor(public response: HttpErrorResponse) {
    this.statusCode = response.status;
    this.errors = response.error?.errors || [];
  }
}
