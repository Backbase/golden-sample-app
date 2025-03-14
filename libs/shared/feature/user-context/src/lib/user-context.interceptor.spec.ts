import { HttpHandler, HttpRequest } from '@angular/common/http';

import { EMPTY } from 'rxjs';
import { MemoryStorage } from 'angular-oauth2-oidc';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserContextInterceptor } from './user-context.interceptor';
import { UserContextService } from './user-context.service';
import { Environment } from '@backbase-gsa/shared/util/config';

describe('UserContextInterceptor', () => {
  function setupInterceptor(
    { apiRoot }: { apiRoot: string } = { apiRoot: '/whatever' }
  ) {
    const environment: Environment = {
      apiRoot,
      production: false,
      locales: [],
      common: { designSlimMode: false },
    };
    const userContextService = new UserContextService(new MemoryStorage());

    const interceptor = new UserContextInterceptor(
      userContextService,
      environment
    );

    const nextHandler = jest.mocked<HttpHandler>({
      handle: jest.fn(),
    });

    return { interceptor, nextHandler, userContextService };
  }

  it('should return the observable returned by the next handler', () => {
    const { interceptor, nextHandler } = setupInterceptor();
    const nextHanderReturnValue = Symbol('mock-return-value');
    nextHandler.handle.mockReturnValue(nextHanderReturnValue as any);
    const result = interceptor.intercept(
      new HttpRequest<any>('GET', '/foo'),
      nextHandler
    );
    expect(result).toBe(nextHanderReturnValue);
  });

  function execute(
    interceptor: UserContextInterceptor,
    nextHandler: jest.Mocked<HttpHandler>,
    requestUrl: string
  ): HttpRequest<any> | undefined {
    const request = new HttpRequest('GET', requestUrl);

    let modifiedRequest: HttpRequest<any> | undefined;

    nextHandler.handle.mockImplementation((r) => {
      modifiedRequest = r;
      return EMPTY;
    });
    interceptor.intercept(request, nextHandler);

    return modifiedRequest;
  }

  it('should add the X-USER-CONTEXT header to outgoing requests to the configured API root, if a user context is set', () => {
    const apiRoot = '/foo/whatever';
    const { interceptor, nextHandler, userContextService } = setupInterceptor({
      apiRoot,
    });
    userContextService.setServiceAgreementId('the-user-context');
    const modifiedRequest = execute(
      interceptor,
      nextHandler,
      `${apiRoot}/someurl`
    );
    expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toEqual(
      'the-user-context'
    );
  });

  it('should not add the X-USER-CONTEXT header to outgoing requests which do not start with the configured API root', () => {
    const apiRoot = '/foo/whatever';
    const { interceptor, nextHandler, userContextService } = setupInterceptor({
      apiRoot,
    });
    userContextService.setServiceAgreementId('the-user-context');
    const modifiedRequest = execute(interceptor, nextHandler, `/someurl`);
    expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toBeFalsy();
  });

  it('should not add the X-USER-CONTEXT header to outgoing requests if the user context is not set', () => {
    const apiRoot = '/foo/whatever';
    const { interceptor, nextHandler } = setupInterceptor({
      apiRoot,
    });
    const modifiedRequest = execute(
      interceptor,
      nextHandler,
      `${apiRoot}/someurl`
    );
    expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toBeFalsy();
  });

  describe('if the configured api root ends with a slash', () => {
    it('should add the X-USER-CONTEXT header to outgoing requests which start with the configured API root then a non-slash character', () => {
      const apiRoot = '/foo/whatever/';
      const { interceptor, nextHandler, userContextService } = setupInterceptor(
        {
          apiRoot,
        }
      );
      userContextService.setServiceAgreementId('the-user-context');
      const modifiedRequest = execute(
        interceptor,
        nextHandler,
        `${apiRoot}foo/someurl`
      );
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toEqual(
        'the-user-context'
      );
    });
  });

  describe('if the configured api root does not end with a slash', () => {
    it('should not add the X-USER-CONTEXT header to outgoing requests which start with the configured API root then a non-slash character', () => {
      const apiRoot = '/foo/whatever';
      const { interceptor, nextHandler, userContextService } = setupInterceptor(
        {
          apiRoot,
        }
      );
      userContextService.setServiceAgreementId('the-user-context');
      const modifiedRequest = execute(
        interceptor,
        nextHandler,
        `${apiRoot}foo/someurl`
      );
      expect(modifiedRequest?.headers?.get('X-USER-CONTEXT')).toBeFalsy();
    });
  });
});
