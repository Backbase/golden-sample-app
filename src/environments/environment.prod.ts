import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { TransactionsInterceptor } from '../app/interceptors/transactions.interceptor';
import { AccountsInterceptor } from '../app/interceptors/accounts-interceptor';

export const environment = {
  production: true,
  apiURL: '${API_ROOT}',
  mockProviders: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TransactionsInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AccountsInterceptor,
    multi: true,
  },]
};

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: '${AUTH_URL}',

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
