/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AuthService } from '@backbase/identity-auth';
import { ReplaySubject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthGuard } from './auth.guard';

export type WidePropertyTypes<T> = Partial<Record<keyof T, unknown>>;
export const mock = <T>(overrides?: WidePropertyTypes<T>) =>
  ({ ...overrides } as jest.Mocked<T>);

describe('AuthGuard', () => {
  const getInstance = () => {
    const isAuthenticated$$ = new ReplaySubject<boolean>(1);
    const authService = mock<AuthService>({
      isAuthenticated$: isAuthenticated$$.asObservable(),
      initLoginFlow: jest.fn(),
    });
    const guard = new AuthGuard(authService);
    const scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));

    return { guard, authService, isAuthenticated$$, scheduler };
  };

  describe.each([
    { method: 'canLoad' },
    { method: 'canActivate' },
    { method: 'canActivateChild' },
  ])('#$method', ({ method }) => {
    test('returns true when user is authenticated', () => {
      const { guard, scheduler, isAuthenticated$$ } = getInstance();

      scheduler.run(({ expectObservable }) => {
        isAuthenticated$$.next(true);
        expectObservable((<any>guard)[method]()).toBe('x', { x: true });
      });
    });

    test('returns false and calls initLoginFlow when user is not authenticated', () => {
      const { guard, scheduler, isAuthenticated$$, authService } =
        getInstance();

      scheduler.run(({ expectObservable }) => {
        isAuthenticated$$.next(false);
        expectObservable((<any>guard)[method]()).toBe('x', { x: false });
      });
      expect(authService.initLoginFlow).toHaveBeenCalledTimes(1);
    });
  });
});
