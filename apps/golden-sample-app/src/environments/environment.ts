// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { TransactionsInterceptor } from '../app/interceptors/transactions.interceptor';
import { AccountsInterceptor } from '../app/interceptors/accounts-interceptor';
import { AchPositivePayInterceptor } from '../app/interceptors/ach-positive-pay.interceptor';
import { Environment } from './type';
import { EntitlementsInterceptor } from '../app/interceptors/entitlements-interceptor';

const mockProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TransactionsInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AccountsInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AchPositivePayInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: EntitlementsInterceptor,
    multi: true
  }
];

export const environment: Environment = {
  production: false,
  apiRoot: 'https://app.dev.sdbx.live.backbaseservices.com/api',
  mockProviders,
  locales: ['en-US', 'nl-NL'],
};

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://identity.dev.sdbx.live.backbaseservices.com/auth/realms/retail',

  // URL of the SPA to redirect the user to after login
  redirectUri: document.location.origin + '/transactions',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'bb-web-client',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications. (IE: does not support PKCE)
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  scope: 'openid',

  requireHttps: false,

  showDebugInformation: true,

  logoutUrl: document.location.origin + '/login',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.