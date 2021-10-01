import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OAuthService } from "angular-oauth2-oidc";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private oAuthService: OAuthService, private router: Router) {
  }

  canActivate = () => {
    if (this.oAuthService.hasValidAccessToken()) return true;
    this.oAuthService.initLoginFlow();
    return false;
  };
}
