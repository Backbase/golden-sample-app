import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

function extractRejectionError(error: unknown): Error | unknown {
  if (error && typeof error === 'object' && 'rejection' in error) {
    return (error as { rejection: unknown }).rejection;
  }

  return error;
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {}

  handleError(error: Error | unknown): void {
    const extractedError = extractRejectionError(error);

    if (extractedError instanceof HttpErrorResponse) {
      this.ngZone.run(() => {
        this.router.navigate(['/error'], {
          state: {
            error: extractedError,
          },
          skipLocationChange: true,
        });
      });

      return;
    }

    console.error(error);
  }
}
