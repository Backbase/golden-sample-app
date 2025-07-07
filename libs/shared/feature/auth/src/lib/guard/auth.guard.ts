import { inject, Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { AuthService } from '@backbase/identity-auth';
import { Observable, map, of } from 'rxjs';
import { Environment, ENVIRONMENT_CONFIG } from '@backbase/shared/util/config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly authService: AuthService = inject(AuthService);
  private readonly environment: Environment | null = inject(
    ENVIRONMENT_CONFIG,
    { optional: true }
  );

  canLoad(): Observable<boolean | UrlTree> {
    return this.redirectIfUnauthenticated();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.redirectIfUnauthenticated();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.redirectIfUnauthenticated();
  }

  /**
   * If user has an access token in storage they are logged in and may access page.
   * If not, treat them as logged out.
   */
  private redirectIfUnauthenticated(): Observable<boolean | UrlTree> {
    if (this.environment?.mockEnabled) return of(true);

    return this.authService.isAuthenticated$.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return true;
        }

        this.authService.initLoginFlow();
        return false;
      })
    );
  }
}
