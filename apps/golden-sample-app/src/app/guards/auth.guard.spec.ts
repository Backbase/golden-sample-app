import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockOAuthService: any = {};

  beforeEach(() => {
    authGuard = new AuthGuard(mockOAuthService);
  });

  describe('should not activate route', () => {
    it('if the auth service init was finished, but the user is still not authenticated', () => {
      mockOAuthService.initLoginFlow = jest.fn();
      mockOAuthService.hasValidAccessToken = jest.fn(() => false);
      const received = authGuard.canActivate();
      expect(received).toBe(false);
      expect(mockOAuthService.initLoginFlow).toHaveBeenCalled();
    });
  });

  describe('should activate route', () => {
    it('if init is over and the user is authenticated', () => {
      mockOAuthService.hasValidAccessToken = jest.fn(() => true);
      const received = authGuard.canActivate();
      expect(received).toBe(true);
    });
  });
});
