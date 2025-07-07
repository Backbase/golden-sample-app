/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@backbase/identity-auth';
import { ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthGuard } from './auth.guard';
import { Environment, ENVIRONMENT_CONFIG } from '@backbase/shared/util/config';

export type WidePropertyTypes<T> = Partial<Record<keyof T, unknown>>;
export const mock = <T>(overrides?: WidePropertyTypes<T>) =>
  ({ ...overrides } as jest.Mocked<T>);

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jest.Mocked<AuthService>;
  let isAuthenticated$$: ReplaySubject<boolean>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    isAuthenticated$$ = new ReplaySubject<boolean>(1);
    authService = mock<AuthService>({
      isAuthenticated$: isAuthenticated$$.asObservable(),
      initLoginFlow: jest.fn(),
    });
    const environment: Environment = {
      production: false,
      apiRoot: '',
      locales: [],
      common: { designSlimMode: false },
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: ENVIRONMENT_CONFIG, useValue: environment },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));
  });

  describe.each([
    { method: 'canLoad' },
    { method: 'canActivate' },
    { method: 'canActivateChild' },
  ])('#$method', ({ method }) => {
    test('returns true when user is authenticated', () => {
      scheduler.run(({ expectObservable }) => {
        isAuthenticated$$.next(true);
        expectObservable((<any>guard)[method]()).toBe('x', { x: true });
      });
    });

    test('returns false and calls initLoginFlow when user is not authenticated', () => {
      scheduler.run(({ expectObservable }) => {
        isAuthenticated$$.next(false);
        expectObservable((<any>guard)[method]()).toBe('x', { x: false });
      });
      expect(authService.initLoginFlow).toHaveBeenCalledTimes(1);
    });
  });
});
