import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

function toErrorObject(error: Error | unknown): Error | undefined {
  if (error && typeof error === 'object' && 'rejection' in error) {
    error = (error as { rejection: Error | unknown }).rejection;
  }

  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    'message' in error
  ) {
    return error as Error;
  }

  return undefined;
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {}

  handleError(error: Error | unknown | { rejection: Error | unknown }): void {
    const errorObject = toErrorObject(error);

    if (errorObject?.name === 'NotFoundError') {
      this.ngZone.run(() => {
        this.router.navigate(['/error'], {
          state: {
            message: errorObject.message,
          },
          skipLocationChange: true,
        });
      });

      return;
    }

    console.error(error);
  }
}
