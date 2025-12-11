import { inject, Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { AuthService } from '@backbase/identity-auth';
import { map, Observable } from 'rxjs';

// TODO: Refactor to be a function guard?
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  readonly #authService: AuthService = inject(AuthService);

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
    return this.#authService.isAuthenticated$.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return true;
        }

        this.#authService.initLoginFlow();
        return false;
      })
    );
  }
}
