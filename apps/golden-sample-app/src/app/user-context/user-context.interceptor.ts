/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { UserContextService } from './user-context.service';
import { environment } from '../../environments/environment';

/**
 * An `environment.apiRoot` wrapper to enable mock in tests.
 */
export const API_ROOT = new InjectionToken<string>('API_ROOT', {
  providedIn: 'root',
  factory: () => environment.apiRoot,
});

/**
 * Adds the X-USER-CONTEXT header with the currently active service agreement ID
 * to each outgoing request whose URL starts with the configured API root.
 */
@Injectable()
export class UserContextInterceptor implements HttpInterceptor {
  private readonly apiRoot: string;
  constructor(
    private readonly userContextService: UserContextService,
    @Inject(API_ROOT) apiRoot: string
  ) {
    this.apiRoot = apiRoot.endsWith('/') ? apiRoot : `${apiRoot}/`;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const context = this.userContextService.getServiceAgreementId();
    if (context && req.url.startsWith(this.apiRoot)) {
      const headers = req.headers.set('X-USER-CONTEXT', context);
      req = req.clone({ headers });
    }
    return next.handle(req);
  }
}
