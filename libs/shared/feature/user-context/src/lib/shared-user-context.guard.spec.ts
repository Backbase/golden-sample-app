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

  let guard: SharedUserContextGuard;

  beforeEach(() => {
    mockServiceAgreementHttpService.getServiceAgreementContext.mockReset();

    TestBed.configureTestingModule({
      providers: [
        SharedUserContextGuard,
        { provide: Router, useValue: mockRouter },
        {
          provide: ServiceAgreementsHttpService,
          useValue: mockServiceAgreementHttpService,
        },
      ],
    });

    guard = TestBed.inject(SharedUserContextGuard);
  });

  describe(`when a context has not been selected`, () => {
    beforeEach(() => {
      mockServiceAgreementHttpService.getServiceAgreementContext.mockReturnValue(
        cold('-#')
      );
    });

    it('should retain the target URL for the initial navigation', () => {
      guard.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot);
      expect(guard.getTargetUrl()).toEqual(MOCK_TARGET_URL);
    });

    it('should return a URL tree pointing to /select-context', () => {
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
    beforeEach(() => {
      mockServiceAgreementHttpService.getServiceAgreementContext.mockReturnValue(
        cold('-(a|)')
      );
    });

    it('should return an Observable of boolean true', () => {
      const result = guard.canActivate(
        fakeActivatedRouteSnapshot,
        fakeRouterStateSnapshot
      );
      expect(result).toBeObservable(cold('-(a|)', { a: true }));
    });

    it('should not repeatedly call the accesscontrol service after the context has been validated once', (done) => {
      mockServiceAgreementHttpService.getServiceAgreementContext.mockReturnValue(
        of(<any>{})
      );

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
