import { BehaviorSubject } from 'rxjs';
import { AppAuthService } from '../services/app-auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const authServiceStub = jasmine.createSpyObj<AppAuthService>(['login']);
  let isAuthenticated$$: BehaviorSubject<boolean>;
  let isDoneLoading$$: BehaviorSubject<boolean>;

  beforeEach(() => {
    isAuthenticated$$ = new BehaviorSubject<boolean>(false);
    isDoneLoading$$ = new BehaviorSubject<boolean>(false);

    Object.assign(authServiceStub, {
      isAuthenticated$: isAuthenticated$$,
      isDoneLoading$: isDoneLoading$$,
    });

    authGuard = new AuthGuard(authServiceStub);
  });

  describe('should not activate route', () => {
    it('if the auth service init was finished, but the user is still not authenticated', (done: DoneFn) => {
      isDoneLoading$$.next(true);
      authGuard.canActivate().subscribe((received) => {
        expect(received).toBeFalse();
        expect(authServiceStub.login).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('should activate route', () => {
    it('if init is over and the user is authenticated', (done: DoneFn) => {
      isDoneLoading$$.next(true);
      isAuthenticated$$.next(true);
      authGuard.canActivate().subscribe((received) => {
        expect(received).toBeTrue();
        done();
      });
    });
  });
});
