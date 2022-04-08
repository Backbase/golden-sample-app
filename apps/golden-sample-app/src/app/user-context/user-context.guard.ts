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
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserContextGuard implements CanActivate, CanActivateChild {
  private targetUrl: string | undefined;
  private cookieValid = false;

  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly serviceAgreementService: ServiceAgreementHttpService,
  ) { }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.targetUrl = state.url;
    const cookieIsSet = this.cookieService.check('USER_CONTEXT');
    console.log('cookieIsSet', cookieIsSet);
    if (!cookieIsSet) {
      return this.getSelectContextUrlTree();
    }

    return (
      this.cookieValid ||
      this.validateUserContextCookie().pipe(map(isValid => isValid || this.getSelectContextUrlTree()))
    );
  }

  getTargetUrl() {
    return this.targetUrl;
  }

  private getSelectContextUrlTree(): UrlTree {
    return this.router.createUrlTree(['/select-context']);
  }

  private validateUserContextCookie(): Observable<boolean> {
    return this.serviceAgreementService.getServiceAgreementContext().pipe(
      map(() => {
        this.cookieValid = true;
        return this.cookieValid;
      }),
      catchError(() => {
        this.cookieValid = false;
        return of(this.cookieValid);
      }),
    );
  }
}