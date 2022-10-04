import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { share } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthInterceptor } from './auth.interceptor';
import * as utils from './auth.utils';

export type WidePropertyTypes<T> = Partial<Record<keyof T, unknown>>;
export const mock = <T>(overrides?: WidePropertyTypes<T>) =>
  ({ ...overrides } as jest.Mocked<T>);

describe('Auth Interceptor', () => {
  const getInstance = () => {
    const oAuthService = mock<OAuthService>({
      refreshToken: jest.fn(),
    });
    const authUtils = {
      isInvalidToken401: jest.spyOn(utils, 'isInvalidToken401'),
    };
    const interceptor = new AuthInterceptor(oAuthService);
    const next = mock<HttpHandler>({
      handle: jest.fn(),
    });
    const scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));
    const refreshToken = jest.spyOn(<any>interceptor, 'refreshToken');

    return { authUtils, interceptor, next, scheduler, refreshToken };
  };

  const getData = () => {
    const request = new HttpRequest('GET', 'someurl');
    const accessToken = 'access_token';
    const capabilityResponse = {
      invalidToken: new HttpErrorResponse({
        status: 401,
        headers: new HttpHeaders({
          'WWW-Authenticate': 'Bearer error="invalid_token',
        }),
      }),
      notFound: new HttpErrorResponse({ status: 404 }),
      success: new HttpResponse(),
    };
    const refreshTokenResponse = { access_token: accessToken };
    const refreshTokenErrorResponse = new HttpErrorResponse({ status: 400 });

    return {
      request,
      accessToken,
      capabilityResponse,
      refreshTokenResponse,
      refreshTokenErrorResponse,
    };
  };

  describe('when isInvalidToken401 returns true', () => {
    it('should replay the request with new access token', () => {
      const { interceptor, authUtils, next, scheduler, refreshToken } =
        getInstance();
      const { request, capabilityResponse, refreshTokenResponse, accessToken } =
        getData();

      scheduler.run(({ cold, expectObservable }) => {
        next.handle
          .mockReturnValueOnce(cold('-#', {}, capabilityResponse.invalidToken))
          .mockReturnValueOnce(
            cold('-(x|)', { x: capabilityResponse.success })
          );
        authUtils.isInvalidToken401.mockReturnValue(true);
        refreshToken.mockReturnValue(
          cold('-(x|)', { x: refreshTokenResponse })
        );

        const stream$ = interceptor.intercept(request, next).pipe(share());

        expectObservable(stream$).toBe('---(x|)', {
          x: capabilityResponse.success,
        });
      });

      expect(next.handle).toHaveBeenCalledTimes(2);
      expect(
        next.handle.mock.calls[1][0].headers.get('Authorization')
      ).toContain(accessToken);
    });

    it('should call to refresh token only once when multiple requests occur', () => {
      const { interceptor, authUtils, next, scheduler, refreshToken } =
        getInstance();
      const { request, capabilityResponse, refreshTokenResponse } = getData();
      const next2 = mock<HttpHandler>({
        handle: jest.fn(),
      });

      scheduler.run(({ cold, expectObservable }) => {
        next.handle
          .mockReturnValueOnce(cold('-#', {}, capabilityResponse.invalidToken))
          .mockReturnValueOnce(
            cold('-(x|)', { x: capabilityResponse.success })
          );
        next2.handle
          .mockReturnValueOnce(cold('-#', {}, capabilityResponse.invalidToken))
          .mockReturnValueOnce(
            cold('-(x|)', { x: capabilityResponse.success })
          );
        authUtils.isInvalidToken401.mockReturnValue(true);
        refreshToken.mockReturnValue(
          cold('-(x|)', { x: refreshTokenResponse })
        );

        const stream1$ = interceptor.intercept(request, next).pipe(share());
        const stream2$ = interceptor.intercept(request, next2).pipe(share());

        expectObservable(stream1$).toBe('---(x|)', {
          x: capabilityResponse.success,
        });
        expectObservable(stream2$).toBe('---(x|)', {
          x: capabilityResponse.success,
        });
      });

      expect(refreshToken).toHaveBeenCalledTimes(1);
      expect(next.handle).toHaveBeenCalledTimes(2);
      expect(next2.handle).toHaveBeenCalledTimes(2);
    });

    it('should throw back up initial invalid token error when refreshing', () => {
      const { interceptor, authUtils, next, scheduler, refreshToken } =
        getInstance();
      const { request, capabilityResponse, refreshTokenErrorResponse } =
        getData();

      scheduler.run(({ cold, expectObservable }) => {
        next.handle.mockReturnValueOnce(
          cold('-#', {}, capabilityResponse.invalidToken)
        );
        authUtils.isInvalidToken401.mockReturnValue(true);
        refreshToken.mockReturnValue(cold('-#', {}, refreshTokenErrorResponse));

        const stream1$ = interceptor.intercept(request, next).pipe(share());

        expectObservable(stream1$).toBe(
          '--#',
          {},
          capabilityResponse.invalidToken
        );
      });

      expect(next.handle).toHaveBeenCalledTimes(1);
    });
  });

  describe('when isInvalidToken401 returns false', () => {
    it('should re-throw the original error', () => {
      const { interceptor, authUtils, next, scheduler } = getInstance();
      const { request, capabilityResponse } = getData();

      scheduler.run(({ cold, expectObservable }) => {
        next.handle.mockReturnValue(
          cold('-#', {}, capabilityResponse.notFound)
        );
        authUtils.isInvalidToken401.mockReturnValue(false);

        const stream$ = interceptor.intercept(request, next).pipe(share());

        expectObservable(stream$).toBe('-#', {}, capabilityResponse.notFound);
      });
    });
  });
});
