import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

function extractRejectionError(error: unknown): Error | unknown {
  if (error && typeof error === 'object' && 'rejection' in error) {
    return (error as { rejection: unknown }).rejection;
  }

  return error;
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly router: Router = inject(Router);
  private readonly ngZone: NgZone = inject(NgZone);

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
