/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { SharedUserContextService } from './shared-user-context.service';
import { API_ROOT } from '@backbase/foundation-ang/core';

/**
 * Adds the X-USER-CONTEXT header with the currently active service agreement ID
 * to each outgoing request whose URL starts with the configured API root.
 */
@Injectable()
export class SharedUserContextInterceptor implements HttpInterceptor {
  readonly #userContextService: SharedUserContextService = inject(
    SharedUserContextService
  );
  readonly #apiRoot: string = inject(API_ROOT);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const context = this.#userContextService.getServiceAgreementId();
    if (context && req.url.startsWith(this.#apiRoot)) {
      const headers = req.headers.set('X-USER-CONTEXT', context);
      req = req.clone({ headers });
    }
    return next.handle(req);
  }
}
