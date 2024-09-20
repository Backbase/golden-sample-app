import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tracker, TrackerEvent, TrackerEventPayload } from '@backbase/foundation-ang/observability';

interface ClientErrorTrackerEventPayload extends TrackerEventPayload {
    status: number;
    statusText: string;
}

interface ServerErrorTrackerEventPayload extends TrackerEventPayload {
    status: number;
    statusText: string;
}

class ClientErrorTrackerEvent extends TrackerEvent<'client-error', ClientErrorTrackerEventPayload> {
    readonly name = 'client-error';
}
class ServerErrorTrackerEvent extends TrackerEvent<'server-error', ServerErrorTrackerEventPayload> {
    readonly name = 'server-error';
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private tracker: Tracker) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 400 && error.status < 600) {
          // Handle client errors (4xx) and server errors (5xx)
          console.error('HTTP Error Intercepted:', error);

          if (error.status >= 500) {
            console.error('Server error occurred:', error.message);
            
            switch(error.status) {
                case 500: 
                default: this.tracker?.publish(new ServerErrorTrackerEvent({ status: error.status, statusText: error.statusText }));
            }
          } else if (error.status >= 400) {
            console.error('Client error occurred:', error.message);
            switch(error.status) {
                case 400: 
                default: this.tracker?.publish(new ClientErrorTrackerEvent({ status: error.status, statusText: error.statusText }));
            }
          }
        }

        // Rethrow the error so it can be handled by the component if needed
        return throwError(() => error);
      })
    );
  }
}