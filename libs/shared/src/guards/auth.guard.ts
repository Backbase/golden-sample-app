import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { AuthService } from '@backbase/identity-auth';
import { Observable, map, of } from 'rxjs';
import { EnvironmentService } from '../environment/environment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private readonly authService: AuthService, private readonly envService: EnvironmentService) {}

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
    if (this.envService.environment?.mockEnabled) return of(true);

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
