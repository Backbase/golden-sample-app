import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { TransactionsInterceptor } from '../app/interceptors/transactions.interceptor';
import { AccountsInterceptor } from '../app/interceptors/accounts-interceptor';

const pageConfig = {
  locales: '${LOCALES}'.split(','),
  apiRoot: '${PATHNAME}api',
  staticResourcesRoot: '${PATHNAME}',
  locale: 'en-US',
  cx: {
    kind: "hybrid",
    scope: "${AUTH_SCOPE}",
    authUrl: "${AUTH_URL}",
    realm: "${AUTH_REALM}",
    clientId: "${AUTH_CLIENT_ID}",
    landingPageUrl: '${PROTOCOL}//${HOSTNAME}${PATHNAME}${AUTH_LANDING_PAGE}',
    loginPageUrl: '${PROTOCOL}//${HOSTNAME}${PATHNAME}${AUTH_REDIRECT_PAGE}',
  }
};

export const environment = {
  production: true,
  apiURL: '${API_ROOT}',
  pageConfig,
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
  issuer: pageConfig.cx.authUrl,

  // URL of the SPA to redirect the user to after login
  redirectUri: pageConfig.cx.landingPageUrl,

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: pageConfig.cx.clientId,

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications. (IE: does not support PKCE)
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  scope: pageConfig.cx.scope,

  requireHttps: false,

  showDebugInformation: true,

  logoutUrl: pageConfig.cx.loginPageUrl,

  // Explicitly add flag to make possible refresh of the token
  // without going through login flow
  useSilentRefresh: true,
  silentRefreshTimeout: 5000,
};
