import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { EMPTY } from 'rxjs';
import { MemoryStorage } from 'angular-oauth2-oidc';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SharedUserContextInterceptor } from './shared-user-context.interceptor';
import { SharedUserContextService } from './shared-user-context.service';
import { Environment, ENVIRONMENT_CONFIG } from '@backbase/shared/util/config';

describe('UserContextInterceptor', () => {
  describe('with default API root', () => {
    let interceptor: SharedUserContextInterceptor;
    let nextHandler: jest.Mocked<HttpHandler>;
    let userContextService: SharedUserContextService;
    const apiRoot = '/whatever';

    beforeEach(() => {
      const environment: Environment = {
        apiRoot,
        production: false,
        locales: [],
        common: { designSlimMode: false },
      };

      TestBed.configureTestingModule({
        providers: [
          SharedUserContextInterceptor,
          SharedUserContextService,
          { provide: ENVIRONMENT_CONFIG, useValue: environment },
        ],
      });

      interceptor = TestBed.inject(SharedUserContextInterceptor);
      userContextService = TestBed.inject(SharedUserContextService);
      nextHandler = jest.mocked<HttpHandler>({
        handle: jest.fn(),
      });

      // Clear any stored service agreement ID from previous tests
      sessionStorage.removeItem('bb-user-context');
    });

    function execute(requestUrl: string): HttpRequest<any> | undefined {
      const request = new HttpRequest('GET', requestUrl);

      let modifiedRequest: HttpRequest<any> | undefined;

      nextHandler.handle.mockImplementation((r) => {
        modifiedRequest = r;
        return EMPTY;
      });
      interceptor.intercept(request, nextHandler);

      return modifiedRequest;
    }

    it('should return the observable returned by the next handler', () => {
      const nextHanderReturnValue = Symbol('mock-return-value');
      nextHandler.handle.mockReturnValue(nextHanderReturnValue as any);
      const result = interceptor.intercept(
        new HttpRequest<any>('GET', '/foo'),
        nextHandler
      );
      expect(result).toBe(nextHanderReturnValue);
    });

    it('should add the X-USER-CONTEXT header to outgoing requests to the configured API root, if a user context is set', () => {
      userContextService.setServiceAgreementId('the-user-context');
      const modifiedRequest = execute(`${apiRoot}/someurl`);
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toEqual(
        'the-user-context'
      );
    });

    it('should not add the X-USER-CONTEXT header to outgoing requests which do not start with the configured API root', () => {
      userContextService.setServiceAgreementId('the-user-context');
      const modifiedRequest = execute(`/someurl`);
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toBeFalsy();
    });

    it('should not add the X-USER-CONTEXT header to outgoing requests if the user context is not set', () => {
      const modifiedRequest = execute(`${apiRoot}/someurl`);
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toBeFalsy();
    });
  });

  describe('with API root ending with slash', () => {
    let interceptor: SharedUserContextInterceptor;
    let nextHandler: jest.Mocked<HttpHandler>;
    let userContextService: SharedUserContextService;
    const apiRoot = '/foo/whatever/';

    beforeEach(() => {
      const environment: Environment = {
        apiRoot,
        production: false,
        locales: [],
        common: { designSlimMode: false },
      };

      TestBed.configureTestingModule({
        providers: [
          SharedUserContextInterceptor,
          SharedUserContextService,
          { provide: ENVIRONMENT_CONFIG, useValue: environment },
        ],
      });

      interceptor = TestBed.inject(SharedUserContextInterceptor);
      userContextService = TestBed.inject(SharedUserContextService);
      nextHandler = jest.mocked<HttpHandler>({
        handle: jest.fn(),
      });

      // Clear any stored service agreement ID from previous tests
      sessionStorage.removeItem('bb-user-context');
    });

    function execute(requestUrl: string): HttpRequest<any> | undefined {
      const request = new HttpRequest('GET', requestUrl);

      let modifiedRequest: HttpRequest<any> | undefined;

      nextHandler.handle.mockImplementation((r) => {
        modifiedRequest = r;
        return EMPTY;
      });
      interceptor.intercept(request, nextHandler);

      return modifiedRequest;
    }

    it('should add the X-USER-CONTEXT header to outgoing requests which start with the configured API root then a non-slash character', () => {
      userContextService.setServiceAgreementId('the-user-context');
      const modifiedRequest = execute(`${apiRoot}foo/someurl`);
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toEqual(
        'the-user-context'
      );
    });
  });

  describe('with API root not ending with slash', () => {
    let interceptor: SharedUserContextInterceptor;
    let nextHandler: jest.Mocked<HttpHandler>;
    let userContextService: SharedUserContextService;
    const apiRoot = '/foo/whatever';

    beforeEach(() => {
      const environment: Environment = {
        apiRoot,
        production: false,
        locales: [],
        common: { designSlimMode: false },
      };

      TestBed.configureTestingModule({
        providers: [
          SharedUserContextInterceptor,
          SharedUserContextService,
          { provide: ENVIRONMENT_CONFIG, useValue: environment },
        ],
      });

      interceptor = TestBed.inject(SharedUserContextInterceptor);
      userContextService = TestBed.inject(SharedUserContextService);
      nextHandler = jest.mocked<HttpHandler>({
        handle: jest.fn(),
      });

      // Clear any stored service agreement ID from previous tests
      sessionStorage.removeItem('bb-user-context');
    });

    function execute(requestUrl: string): HttpRequest<any> | undefined {
      const request = new HttpRequest('GET', requestUrl);

      let modifiedRequest: HttpRequest<any> | undefined;

      nextHandler.handle.mockImplementation((r) => {
        modifiedRequest = r;
        return EMPTY;
      });
      interceptor.intercept(request, nextHandler);

      return modifiedRequest;
    }

    it('should not add the X-USER-CONTEXT header to outgoing requests which start with the configured API root then a non-slash character', () => {
      userContextService.setServiceAgreementId('the-user-context');
      const modifiedRequest = execute(`${apiRoot}foo/someurl`);
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toBeFalsy();
    });
  });
});
