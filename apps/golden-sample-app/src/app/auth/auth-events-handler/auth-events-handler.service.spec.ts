import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Subject, Subscription } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthEventsHandlerService } from './auth-events-handler.service';

export type WidePropertyTypes<T> = Partial<Record<keyof T, unknown>>;
export const mock = <T>(overrides?: WidePropertyTypes<T>) =>
  ({ ...overrides } as jest.Mocked<T>);
describe('AuthEventsHandlerService', () => {
  const getInstance = () => {
    const events$$ = new Subject<OAuthEvent>();
    const oAuthService = mock<OAuthService>({
      events: events$$.asObservable(),
      refreshToken: jest.fn(),
      revokeTokenAndLogout: jest.fn(),
      initLoginFlow: jest.fn(),
      hasValidAccessToken: jest.fn().mockReturnValue(true),
    });
    const service = new AuthEventsHandlerService(oAuthService, 'en');
    const scheduler = new TestScheduler((a, e) => expect(a).toEqual(e));

    return { service, oAuthService, events$$, scheduler };
  };

  describe('Document load', () => {
    it('should not handle events if document is not loaded', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'token_expires' });
        flush();
      });

      expect(oAuthService.refreshToken).not.toHaveBeenCalled();
    });
    it('should handle events when document is loaded', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'token_expires' });
        flush();
      });

      expect(oAuthService.refreshToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('Refreshing access tokens', () => {
    it('should refresh an access token that expires', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'token_expires' });
        flush();
      });

      expect(oAuthService.refreshToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('Revoking tokens and logging out', () => {
    it('should revoke tokens and log out the user when refresh token errors', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'token_refresh_error' });
        flush();
      });

      expect(oAuthService.revokeTokenAndLogout).toHaveBeenCalledTimes(1);
    });
    it('should revoke tokens and log out the user when token errors', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'token_error' });
        flush();
      });

      expect(oAuthService.revokeTokenAndLogout).toHaveBeenCalledTimes(1);
    });
    it('should revoke tokens and log out the user when code exchange errors', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'code_error' });
        flush();
      });

      expect(oAuthService.revokeTokenAndLogout).toHaveBeenCalledTimes(1);
    });
    it('should revoke tokens and log out the user when the session errors', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'session_error' });
        flush();
      });

      expect(oAuthService.revokeTokenAndLogout).toHaveBeenCalledTimes(1);
    });
    it('should revoke tokens and log out the user when the session is terminated', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'session_terminated' });
        flush();
      });

      expect(oAuthService.revokeTokenAndLogout).toHaveBeenCalledTimes(1);
    });
    it('should call initLoginFlow when the user does not have a valid access token', () => {
      const { events$$, oAuthService, scheduler } = getInstance();
      oAuthService.hasValidAccessToken.mockReturnValue(false);

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'token_refresh_error' });
        flush();
      });

      expect(oAuthService.initLoginFlow).toHaveBeenCalledTimes(1);
    });
  });

  describe('Redirecting to login page', () => {
    it('should redirect the user to the login page when they use an invalid nonce state', () => {
      const { events$$, oAuthService, scheduler } = getInstance();

      scheduler.run(({ flush }) => {
        events$$.next({ type: 'discovery_document_loaded' });
        events$$.next({ type: 'invalid_nonce_in_state' });
        flush();
      });

      expect(oAuthService.initLoginFlow).toHaveBeenCalledTimes(1);
    });
  });

  describe('#ngOnDestroy', () => {
    it('should close events subscription', () => {
      const { service } = getInstance();
      const subscription: Subscription = (<any>service).eventsSubscription;

      expect(subscription.closed).toBe(false);

      service.ngOnDestroy();

      expect(subscription.closed).toBe(true);
    });
  });
});
