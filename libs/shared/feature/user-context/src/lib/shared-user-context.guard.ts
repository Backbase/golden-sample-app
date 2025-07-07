import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ServiceAgreementsHttpService } from '@backbase/accesscontrol-v3-http-ang';
import { Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
export class SharedUserContextGuard {
  private targetUrl: string | undefined;
  private contextValid = false;

  private readonly router: Router = inject(Router);
  private readonly serviceAgreementService: ServiceAgreementsHttpService =
    inject(ServiceAgreementsHttpService);

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.canActivate(childRoute, state);
  }

  canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.targetUrl = state.url;

    return (
      this.contextValid ||
      this.validateUserContextCookie().pipe(
        map((isValid) => isValid || this.getSelectContextUrlTree())
      )
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
    return this.serviceAgreementService.getServiceAgreementContext().pipe(
      map(() => true),
      catchError(() => of(false)),
      tap((result) => (this.contextValid = result))
    );
  }
}
