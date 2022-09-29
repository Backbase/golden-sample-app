import { Injectable, OnDestroy } from '@angular/core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthEventsHandlerService implements OnDestroy {
  private eventsSubscription: Subscription;
  private documentLoaded = false;
  constructor(private readonly oAuthService: OAuthService) {
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
        if (!this.documentLoaded && event.type !== 'discovery_document_loaded') return;

        switch (event.type) {
          case 'discovery_document_loaded':
            this.documentLoaded = true;
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
            this.oAuthService.initLoginFlow();
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
    if (this.oAuthService.hasValidAccessToken()) {
      this.oAuthService.revokeTokenAndLogout();
    } else {
      this.oAuthService.initLoginFlow();
    }
  }
}
