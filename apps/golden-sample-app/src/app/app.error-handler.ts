import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Tracker, TrackerEvent, TrackerEventBase, TrackerEventPayload } from '@backbase/foundation-ang/observability';

function extractRejectionError(error: unknown): Error | unknown {
  if (error && typeof error === 'object' && 'rejection' in error) {
    return (error as { rejection: unknown }).rejection;
  }

  return error;
}

type Optional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;

export interface UnhandledErrorTrackerEventPayload extends TrackerEventPayload {
  message: string;
  stack: string;
}

export class UnhandledErrorTrackerEvent<
  T extends Optional<TrackerEventBase, 'name'> = { payload: UnhandledErrorTrackerEventPayload },
> extends TrackerEvent<T['name'] & string, NonNullable<T['payload']>> {
  readonly name = 'unhandled-error';
  constructor(payload: NonNullable<T['payload']>, journey?: string) {
    super(payload, journey);
  }
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private readonly router: Router,    
    private readonly ngZone: NgZone,
    private injector: Injector
  ) {}

  handleError(error: Error | unknown): void {
    const tracker = this.injector.get(Tracker);
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

    if (error instanceof Error) {
      // Publish the error using your Tracker service
      tracker?.publish(new UnhandledErrorTrackerEvent({ 
        message: error?.message,
        stack: error?.stack || 'Unknown error stack',
      }));
    } else {
      // Publish the error using your Tracker service
      tracker?.publish(new UnhandledErrorTrackerEvent({ 
        message: 'Unknown error message',
        stack: 'Unknown error stack',
      }));
    }
    
    console.error(error);
  }
}
