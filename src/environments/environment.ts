// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { CONDITIONS } from '@backbase/foundation-ang/web-sdk';
import { AuthConfig } from 'angular-oauth2-oidc';
import { TransactionsInterceptor } from '../app/interceptors/transactions.interceptor';
import { AccountsInterceptor } from '../app/interceptors/accounts-interceptor';
import { triplets } from '../app/services/entitlementsTriplets';


const buildEntitlementsByUser = (userPermissions: Record<string, boolean>): (triplet: string) => Promise<boolean> => (triplet: string) => new Promise((resolve) => {
    Object.keys(userPermissions).forEach((key) => {
      if (triplet === key) {
        resolve(userPermissions[key]);
      }
    });
  });

const mockProviders: Provider[] = [
  {
    provide: CONDITIONS,
    useFactory: () => ({
      resolveEntitlements(triplet: string) {
        return buildEntitlementsByUser({
          [triplets.canMakeLimitlessAmountTransfer]: true,
          [triplets.canViewTransactions]: true,
          [triplets.canViewTransfer]: true,
        })(triplet);
      },
    }),
    deps: []
  },
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
];

export const environment = {
  production: false,
  apiRoot: 'https://app.stable.retail.backbasecloud.com/api',
  mockProviders,
};

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://identity-latest-universal.retail.backbase.eu/auth/realms/backbase',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/transactions',

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
  scope: 'openid profile email',

  requireHttps: false,

  showDebugInformation: true,

  logoutUrl: window.location.origin + '/login',

  // Explicitly add flag to make possible refresh of the token
  // without going through login flow
  useSilentRefresh: true,
  silentRefreshTimeout: 5000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
