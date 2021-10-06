import { AuthGuard } from './auth.guard';
import { OAuthService } from 'angular-oauth2-oidc';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const authServiceStub = jasmine.createSpyObj<OAuthService>([ 'initLoginFlow', 'hasValidAccessToken' ]);

  beforeEach(() => {
    authGuard = new AuthGuard(authServiceStub);
  });

  describe('should not activate route', () => {
    it('if the auth service init was finished, but the user is still not authenticated', () => {
      authServiceStub.hasValidAccessToken.and.returnValue(false);

      const received = authGuard.canActivate();

      expect(received).toBeFalse();
      expect(authServiceStub.initLoginFlow).toHaveBeenCalled();
    });
  });

  describe('should activate route', () => {
    it('if init is over and the user is authenticated', () => {
      authServiceStub.hasValidAccessToken.and.returnValue(true);

      const received = authGuard.canActivate();

      expect(received).toBeTrue();
    });
  });
});
