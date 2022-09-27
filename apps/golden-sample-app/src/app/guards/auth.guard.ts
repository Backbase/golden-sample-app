import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private oAuthService: OAuthService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  canActivate(): boolean {
    if (this.oAuthService.hasValidAccessToken()) {
      return true;
    }
    this.oAuthService.initLoginFlow(undefined, { ui_locales: this.locale });
    return false;
  }
}
