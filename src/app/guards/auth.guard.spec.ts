import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppAuthService } from '../services/app-auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const authServiceStub = jasmine.createSpyObj<AppAuthService>(['login']);
  let isAuthenticated$$: BehaviorSubject<boolean>;

  const routerStub = jasmine.createSpyObj<Router>(['navigate']);

  beforeEach(() => {
    isAuthenticated$$ = new BehaviorSubject<boolean>(false);
    Object.assign(authServiceStub, {
      isAuthenticated$: isAuthenticated$$,
    });

    authGuard = new AuthGuard(routerStub, authServiceStub);
  });

  describe('if the user is unauthenticated', () => {
    it('should NOT activate route', (done: DoneFn) => {
      authGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe((received) => {
        expect(received).toBeFalse();
        expect(routerStub.navigate).toHaveBeenCalledWith(['login']);
        done();
      });
    });
  });

  describe('if user is authenticated', () => {
    it('should activate route', (done: DoneFn) => {
      isAuthenticated$$.next(true);
      authGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe((received) => {
        expect(received).toBeTrue();
        done();
      });
    });
  });
});
