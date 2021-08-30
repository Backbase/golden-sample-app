import { AuthConfig } from 'angular-oauth2-oidc';

export const environment = {
  production: true,
  apiURL: '${API_URL}',
  mockProviders: []
};

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: '${ISSUER}',

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
};
