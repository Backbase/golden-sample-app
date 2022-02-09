import { Component } from '@angular/core';
import { LOGOUT } from '@backbase/foundation-ang/web-sdk';
import { OAuthService } from 'angular-oauth2-oidc';

// This is temporary solution,
// that will be removed after `@backbase/select-context-widget-ang`
// will be updated in the next release

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
export class UserContextComponent { }
