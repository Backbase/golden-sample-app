import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ServiceAgreementHttpService } from '@backbase/data-ang/accesscontrol';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

const COOKIE_KEY = 'USER_CONTEXT';

/**
 * Guard checks if user has the valid service agreement context.
 *
 * Cookie `USER_CONTEXT` is used to do the check.
 * The cookie is set by the API server without SameSite attribute.
 * Therefore, to be able to read the cookie, the proxy server
 * for API requests must be configured.
 */
@Injectable({
  providedIn: 'root',
})
export class UserContextGuard implements CanActivate, CanActivateChild {
  private targetUrl: string | undefined;
  private cookieValid = false;

  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly serviceAgreementService: ServiceAgreementHttpService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    this.targetUrl = state.url;

    return this.validateUserContextCookie().pipe(
      map((isValid) => isValid || this.getSelectContextUrlTree())
    );
  }

  getTargetUrl() {
    return this.targetUrl;
  }

  private getSelectContextUrlTree(): UrlTree {
    return this.router.createUrlTree(['/select-context']);
  }

  /**
   * Validate the cookie by requesting the service agreement
   * associated with the cookie value.
   */
  private validateUserContextCookie(): Observable<boolean> {
    const cookieIsSet = this.cookieService.check(COOKIE_KEY);
    if (!cookieIsSet) {
      this.cookieValid = false;
      return of(false);
    }

    if (this.cookieValid) {
      return of(true);
    }

    return this.serviceAgreementService.getServiceAgreementContext().pipe(
      mapTo(true),
      catchError(() => of(false)),
      map((valid) => {
        this.cookieValid = valid;
        return this.cookieValid;
      })
    );
  }
}
