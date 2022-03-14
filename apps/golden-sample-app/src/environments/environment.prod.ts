import { AuthConfig } from 'angular-oauth2-oidc';
import { Environment } from './type';

export const environment: Environment = {
  production: true,
  apiRoot: '${API_ROOT}',
  locales: '${LOCALES}'.split(','),
  common: {
    designSlimMode: false,
  },
};

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: '${AUTH_URL}',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '${BASE_HREF}' + 'transactions',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: '${AUTH_CLIENT_ID}',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications. (IE: does not support PKCE)
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  scope: '${AUTH_SCOPE}',

  requireHttps: false,

  showDebugInformation: true,

  logoutUrl: window.location.origin + '${BASE_HREF}' + 'logout',
};
