import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { API_ROOT } from '@backbase/foundation-ang/core';
import { Observable } from 'rxjs';

const API_SANDBOX_KEY = new InjectionToken<string>('API_SANDBOX_KEY');

@Injectable()
class ApiSandboxInterceptor implements HttpInterceptor {
  readonly #apiSandboxKey = inject(API_SANDBOX_KEY);
  readonly #apiRoot = inject(API_ROOT);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.#apiRoot)) {
      req = req.clone({
        setHeaders: {
          'X-SDBXAZ-API-KEY': this.#apiSandboxKey,
        },
      });
    }

    return next.handle(req);
  }
}

/**
 * Provides an interceptor that adds the given API sandbox key to the request headers.
 * @param apiSandboxKey The API sandbox key to add to the request headers.
 * @returns A provider array that sets up the interceptor.
 */
export function provideApiSandboxInterceptor(
  apiSandboxKey: string
): Provider[] {
  return [
    {
      provide: API_SANDBOX_KEY,
      useValue: apiSandboxKey,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiSandboxInterceptor,
      multi: true,
    },
  ];
}

