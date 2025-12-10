import { ApplicationConfig } from '@angular/core';
import { API_ROOT } from '@backbase/foundation-ang/core';
import { provideObservability } from '@backbase/foundation-ang/observability';
import { provideAuthentication } from '@backbase/shared/feature/auth';
import { AuthConfig } from 'angular-oauth2-oidc';
import { baseTelemetryConfig } from './telemetry-config';
import { provideApiSandboxInterceptor } from './api-sandbox-interceptor';

const apiRoot = '${API_ROOT}';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: '${AUTH_URL}',

  // URL of the SPA to redirect the user to after login
  redirectUri: document.baseURI,

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

  requireHttps: true,

  showDebugInformation: true,

  logoutUrl: document.baseURI + 'logout',
};

export const environment: Pick<ApplicationConfig, 'providers'> = {
  providers: [
    {
      provide: API_ROOT,
      useValue: apiRoot,
    },

    ...provideApiSandboxInterceptor('${X-SDBXAZ-API-KEY}'),

    ...provideAuthentication({
      apiRoot,
      authConfig,
    }),

    provideObservability({
      openTelemetryConfig: {
        ...baseTelemetryConfig,
        env: 'production',
        isProduction: true,
        isEnabled: true,
      },
    }),
  ],
};

