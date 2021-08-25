import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected oAuthService: OAuthService,
    private router: Router,
    private oauthService: OAuthService
  ) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    // TODO: Uncomment out when login is ready see ticket WF-343
    // if (this.oauthService.hasValidAccessToken()) {
    //   return true;
    // }

    // this.router.navigate(['login']);
    // return false;
    return true
  }
}
