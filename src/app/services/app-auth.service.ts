import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 *
 * This service is build with external OIDC compliant OAuthService
 * for demonstration purposes, be careful and read all of the comments
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AppAuthService {
  private isAuthenticated$$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.oauthService.events.pipe(map(() => this.oauthService.hasValidAccessToken()));

  private isDoneLoading$$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoading$$.asObservable();

  constructor(private router: Router, private oauthService: OAuthService) {
    /**
     * This is needed only for developer purposes
     * to explore all of the Oauth events
     */
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent Object:', event);
      }
    });

    /**
     * After successful auth and the `token_received` event
     * it will updated isAuthenticated$ to activate the routes
     */
    this.oauthService.events.subscribe((_) => {
      this.isAuthenticated$$.next(this.oauthService.hasValidAccessToken());
    });

    /**
     * Without this setup the silent refresh request
     * will always end up unsunsuccessfully
     */
    this.oauthService.setupAutomaticSilentRefresh();
  }

  /**
   * This is method that will set up oathService to be ready
   * to work with identity provider, it is needed
   * because of the `angular-oauth2-oidc` library inner structure
   */
  public runInitialLoginSequence(): Promise<void> {
    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    return (
      this.oauthService
        .loadDiscoveryDocument()

        // For demo purposes, we pretend the previous call was very slow
        .then(() => new Promise<void>((resolve) => setTimeout(() => resolve(), 1000)))

        // 1. HASH LOGIN:
        // Try to log in via hash fragment after redirect back
        // from IdServer from initImplicitFlow:
        .then(() => this.oauthService.tryLogin())

        .then(() => {
          if (this.oauthService.hasValidAccessToken()) {
            return Promise.resolve();
          }

          // 2. SILENT LOGIN:
          // Try to log in via a refresh because then we can prevent
          // needing to redirect the user:
          // return Promise.resolve();
          return (
            this.oauthService
              .silentRefresh()
              // .then(() => new Promise<void>((resolve) => setTimeout(() => resolve(), 1000)))

              .then(() => Promise.resolve())
              .catch((result) => {
                // debugger;
                // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
                // Only the ones where it's reasonably sure that sending the
                // user to the IdServer will help.
                const errorResponsesRequiringUserInteraction = [
                  'interaction_required',
                  'login_required',
                  'account_selection_required',
                  'consent_required',
                ];

                if (
                  result &&
                  result.reason &&
                  errorResponsesRequiringUserInteraction.indexOf(result.reason.error) >= 0
                ) {
                  // 3. ASK FOR LOGIN:
                  // At this point we know for sure that we have to ask the
                  // user to log in, so we redirect them to the IdServer to
                  // enter credentials.
                  //
                  // Enable this to ALWAYS force a user to login.
                  // this.login();
                  //
                  // Instead, we'll now do this:
                  console.warn('User interaction is needed to log in, we will wait for the user to manually log in.');
                  return Promise.resolve();
                }

                // We can't handle the truth, just pass on the problem to the
                // next handler.
                return Promise.reject(result);
              })
          );
        })
        .then(() => {
          this.isDoneLoading$$.next(true);

          // Check for the strings 'undefined' and 'null' just to be sure. Our current
          // login(...) should never have this, but in case someone ever calls
          // initImplicitFlow(undefined | null) this could happen.
          if (
            this.oauthService.state &&
            this.oauthService.state !== 'undefined' &&
            this.oauthService.state !== 'null'
          ) {
            let stateUrl = this.oauthService.state;
            if (stateUrl.startsWith('/') === false) {
              stateUrl = decodeURIComponent(stateUrl);
            }
            console.log(`There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`);
            this.router.navigate(['login']);
          }
        })
        .catch(() => this.isDoneLoading$$.next(true))
    );
  }

  /**
   * This method is only needed to incapsulate the auth logic
   */
  public login(): void {
    this.oauthService.initLoginFlow();
  }

  /**
   * This method is only needed to incapsulate the auth logic
   */
  public logout(): void {
    this.oauthService.logOut();
  }
}
