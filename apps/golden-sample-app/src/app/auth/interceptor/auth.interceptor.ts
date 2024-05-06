import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject, from, throwError } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  share,
  switchMap,
  take,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment.prod';
import { isInvalidToken401 } from '../utils/auth.utils';

/**
 * Reads Authentication header of HTTP responses to find 'invalid_token' errors.
 * If an 'invalid_token' error is found a token refresh is attempted.
 * If the refresh succeeds the request is replayed with the new access token.
 * If the refresh fails the error is thrown back to the initiating request.
 * A 'token_refresh_error' event should be handled by an auth events handler and the user should be logged out.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly triggerRefresh$$ = new ReplaySubject<void>(1);

  /**
   * The refreshToken$ will seek to refresh the token as few times as possible if
   * the interceptor is called multiple times. Once the new token is received
   * all requests will be replayed.
   */
  private readonly refreshToken$ = this.triggerRefresh$$.pipe(
    exhaustMap(() => this.refreshToken()),
    map((response) => response.access_token),
    share()
  );

  constructor(private readonly oAuthService: OAuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('/auth')) {
      request = request.clone({
        headers: new HttpHeaders({
          'X-SDBXAZ-API-KEY': environment.sandboxApiKey,
        }),
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (isInvalidToken401(error)) {
          this.triggerRefresh$$.next();

          return this.refreshToken$.pipe(
            take(1),
            catchError(() => throwError(() => error)),
            switchMap((token) => this.handleTokenRefresh(request, next, token))
          );
        }
        return throwError(() => error);
      })
    );
  }

  private handleTokenRefresh(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    token: string
  ): Observable<HttpEvent<unknown>> {
    return next.handle(
      request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
  }

  private refreshToken(): Observable<TokenResponse> {
    return from(this.oAuthService.refreshToken());
  }
}
