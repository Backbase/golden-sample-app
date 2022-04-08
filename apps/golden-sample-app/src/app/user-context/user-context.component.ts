import { Component } from '@angular/core';
import { LOGOUT } from '@backbase/foundation-ang/web-sdk';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserContextGuard } from './user-context.guard';

/**
 * The select-context-widget requires a global reloadPage function that returns
 * a Promise before executing an "spa:" navigation on context selection success.
 */
(window as any).reloadPage = () => Promise.resolve();

const logoutFactoryService = (oAuthService: OAuthService) => {
  return {
    goToLoginPage: () => oAuthService.initLoginFlow(),
    logout: () => oAuthService.revokeTokenAndLogout(),
  };
};

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
  providers: [
    {
      provide: LOGOUT,
      useFactory: logoutFactoryService,
      deps: [OAuthService],
    },
  ],
})
export class UserContextComponent {
  constructor(private userContextGuard: UserContextGuard) {}

  getRedirectPage() {
    return `spa:${this.userContextGuard.getTargetUrl()}`;
  }
}
