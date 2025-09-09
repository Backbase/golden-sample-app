// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { API_ROOT } from '@backbase/foundation-ang/core';
import { provideObservability } from '@backbase/foundation-ang/observability';
import { provideAuthentication } from '@backbase/shared/feature/auth';
import { AuthConfig } from 'angular-oauth2-oidc';
import { AchPositivePayInterceptor } from '../app/interceptors/ach-positive-pay.interceptor';
import { AnalyticsService } from '../app/services/analytics.service';
import { provideApiSandboxInterceptor } from './api-sandbox-interceptor';
import { baseTelemetryConfig } from './telemetry-config';
import { provideStoreDevtools } from '@ngrx/store-devtools';

const apiRoot = '/api';

const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer:
    'https://identity.stg.sdbxaz.azure.backbaseservices.com/auth/realms/customer',

  // URL of the SPA to redirect the user to after login
  redirectUri: document.baseURI,

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

  logoutUrl: document.baseURI + 'logout',
};

export const environment: Pick<ApplicationConfig, 'providers'> = {
  providers: [
    provideStoreDevtools(),
    {
      provide: API_ROOT,
      useValue: apiRoot,
    },
    ...provideApiSandboxInterceptor('sandboxApiKey'),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AchPositivePayInterceptor,
      multi: true,
    },

    ...provideAuthentication({
      apiRoot,
      authConfig,
    }),

    provideObservability({
      handler: AnalyticsService,
      openTelemetryConfig: {
        ...baseTelemetryConfig,
        env: 'local',
        isProduction: false,
        isEnabled: true,
      },
    }),
  ],
};
