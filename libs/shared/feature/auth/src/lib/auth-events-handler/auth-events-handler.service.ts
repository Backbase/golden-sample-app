import { Injectable, OnDestroy, Optional } from '@angular/core';
import {
  SessionTimeoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { AuthService } from '@backbase/identity-auth';
import { LocalesService } from '@backbase-gsa/shared/util/app-core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs';

function parseJwt(token: string): { locale: string } | undefined {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return undefined;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthEventsHandlerService implements OnDestroy {
  private eventsSubscription: Subscription;
  private documentLoaded = false;

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly authService: AuthService,
    private readonly localesService: LocalesService,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.eventsSubscription = this.getEventsSubscription();
  }

  /**
   * Subscribes to the observable provided by the `angular-oauth2-oidc` service for auth events.
   * Documentation for these events is provided via the library
   * https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/events.html
   *
   * The handling of events follow our best understanding of how we think applications should
   * behave in each scenario.
   *
   * @returns a subscription to the auth service events
   */
  private getEventsSubscription() {
    return this.oAuthService.events.subscribe({
      next: (event: OAuthEvent) => {
        // Don't handle any events if the document isn't loaded.
        if (!this.documentLoaded && event.type !== 'discovery_document_loaded')
          return;

        switch (event.type) {
          case 'discovery_document_loaded':
            this.documentLoaded = true;
            break;

          // Handle locale changes when the user logs in.
          case 'token_received':
            this.updateLocale();
            break;

          // Expired access tokens are automatically refreshed.
          case 'token_expires':
            this.oAuthService.refreshToken();
            break;

          // Any authentication failure is treated as a terminal auth issue and the user is logged out.
          case 'token_refresh_error':
          case 'token_error':
          case 'code_error':
          case 'session_error':
          case 'session_terminated':
            this.handleTerminatedSession();
            break;

          // Invalid login process is treated as a threat and the user is returned to the login page.
          // As the user is already logged in on the Auth server, they should just be navigated back to the app.
          case 'invalid_nonce_in_state':
            this.authService.initLoginFlow();
            break;
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  /**
   * If user has an access token in storage then log them out.
   * If not, treat them as already logged out and redirect them to their login page.
   */
  private handleTerminatedSession() {
    this.tracker?.publish(new SessionTimeoutTrackerEvent());
    if (this.oAuthService.hasValidAccessToken()) {
      this.oAuthService.logOut();
    } else {
      this.authService.initLoginFlow();
    }
  }

  /**
   * Verifies the app's locale matches the authorization user locale.
   */
  private updateLocale() {
    const token = parseJwt(this.oAuthService.getAccessToken());
    if (token) {
      this.localesService.setLocale(token.locale);
    }
  }
}
