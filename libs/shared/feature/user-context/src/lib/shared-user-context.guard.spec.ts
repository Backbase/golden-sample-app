/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { SharedUserContextGuard } from './shared-user-context.guard';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ServiceAgreementsHttpService } from '@backbase/accesscontrol-v3-http-ang';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

describe('UserContextGuard', () => {
  const MOCK_TARGET_URL = '/foo/bar';

  const fakeRouterStateSnapshot = {
    url: MOCK_TARGET_URL,
  } as unknown as RouterStateSnapshot;

  const fakeActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

  const mockRouter: jest.Mocked<Router> = {
    createUrlTree: jest.fn((urlComponents) => {
      return { urlTreeOf: urlComponents } as unknown as UrlTree;
    }),
  } as Pick<Router, 'createUrlTree'> as any;

  const mockServiceAgreementHttpService: jest.Mocked<ServiceAgreementsHttpService> =
    {
      getServiceAgreementContext: jest.fn(),
    } as Pick<
      ServiceAgreementsHttpService,
      'getServiceAgreementContext'
    > as any;

  function createGuard(validationRequestMarbles?: string) {
    mockServiceAgreementHttpService.getServiceAgreementContext.mockReturnValue(
      validationRequestMarbles ? cold(validationRequestMarbles) : of(<any>{})
    );
    TestBed.configureTestingModule({
      providers: [
        SharedUserContextGuard,
        { provide: Router, useValue: mockRouter },
        { provide: ServiceAgreementsHttpService, useValue: mockServiceAgreementHttpService },
      ],
    });
    return TestBed.inject(SharedUserContextGuard);
  }

  beforeEach(() => {
    mockServiceAgreementHttpService.getServiceAgreementContext.mockReset();
  });

  describe(`when a context has not been selected`, () => {
    it('should retain the target URL for the initial navigation', () => {
      const guard = createGuard('-#');
      guard.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot);
      expect(guard.getTargetUrl()).toEqual(MOCK_TARGET_URL);
    });

    it('should return a URL tree pointing to /select-context', () => {
      const guard = createGuard('-#');
      const result = guard.canActivate(
        fakeActivatedRouteSnapshot,
        fakeRouterStateSnapshot
      );

      expect(result).toBeObservable(
        cold('-(a|)', { a: { urlTreeOf: ['/select-context'] } })
      );
    });
  });

  describe(`when a context has been selected`, () => {
    it('should return an Observable of boolean true', () => {
      const guard = createGuard('-(a|)');
      const result = guard.canActivate(
        fakeActivatedRouteSnapshot,
        fakeRouterStateSnapshot
      );
      expect(result).toBeObservable(cold('-(a|)', { a: true }));
    });

    it('should not repeatedly call the accesscontrol service after the context has been validated once', (done) => {
      const guard = createGuard();
      const firstResult = guard.canActivate(
        fakeActivatedRouteSnapshot,
        fakeRouterStateSnapshot
      );
      (<any>firstResult).subscribe(() => {
        const secondResult = guard.canActivate(
          fakeActivatedRouteSnapshot,
          fakeRouterStateSnapshot
        );
        expect(secondResult).toBe(true);
        expect(
          mockServiceAgreementHttpService.getServiceAgreementContext
        ).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
