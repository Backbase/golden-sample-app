import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  EntitlementsModule,
  ENTITLEMENTS_CONFIG,
} from '@backbase/foundation-ang/entitlements';
import {
  OAuthModule,
  AuthConfig,
  OAuthStorage,
  OAuthModuleConfig,
} from 'angular-oauth2-oidc';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { AnalyticsService } from './services/analytics.service';
import {
  ActivityMonitorModule,
  AuthInterceptor,
} from '@backbase-gsa/shared/feature/auth';
import { environment, authConfig } from '../environments/environment';
import packageInfo from 'package-json';
import { SharedUserContextInterceptor } from '@backbase-gsa/shared/feature/user-context';
import { ApiSandboxInterceptor } from '../environments/api-sandbox-interceptor';
import {
  ACCESS_CONTROL_BASE_PATH,
  ACCESS_CONTROL_BASE_PATH as ACCESS_CONTROL_V3_BASE_PATH,
} from '@backbase/accesscontrol-v3-http-ang';
import { ARRANGEMENT_MANAGER_BASE_PATH } from '@backbase/arrangement-manager-http-ang';
import { TRANSACTIONS_BASE_PATH } from '@backbase/transactions-http-ang';
import { AppErrorHandler } from './app.error-handler';
import { ENVIRONMENT_CONFIG } from '@backbase-gsa/shared/util/config';
import { IdentityAuthModule } from '@backbase/identity-auth';
import { TransactionSigningModule } from '@backbase/identity-auth/transaction-signing';


/**
 * Provides configuration for standalone components
 * while maintaining compatibility with NgModules
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([], withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),

    // Import NgModules
    importProvidersFrom(
      HttpClientModule,
      OAuthModule.forRoot(),
      EntitlementsModule,
      IdentityAuthModule,
      TransactionSigningModule.withConfig({}),
      TrackerModule.forRoot({
        handler: AnalyticsService,
        openTelemetryConfig: {
          appName: packageInfo.name,
          appVersion: packageInfo.version,
          apiKey: environment.bbApiKey,
          env: 'local',
          isProduction: environment.production,
          isEnabled: environment.isTelemetryTracerEnabled,
          url: environment.telemetryCollectorURL,
        },
      }),
      ActivityMonitorModule
    ),

    // Provide common configurations
    { provide: AuthConfig, useValue: authConfig },
    {
      provide: OAuthModuleConfig,
      useValue: {
        resourceServer: {
          allowedUrls: [environment.apiRoot],
          sendAccessToken: true,
        },
      },
    },
    { provide: OAuthStorage, useFactory: () => localStorage },

    // Base path configurations
    {
      provide: TRANSACTIONS_BASE_PATH,
      useValue: environment.apiRoot + '/transaction-manager',
    },
    {
      provide: ARRANGEMENT_MANAGER_BASE_PATH,
      useValue: environment.apiRoot + '/arrangement-manager',
    },
    {
      provide: ACCESS_CONTROL_BASE_PATH,
      useValue: environment.apiRoot + '/access-control',
    },
    {
      provide: ACCESS_CONTROL_V3_BASE_PATH,
      useValue: environment.apiRoot + '/access-control',
    },
    {
      provide: ENTITLEMENTS_CONFIG,
      useValue: {
        accessControlBasePath: `${environment.apiRoot}/access-control`,
      },
    },
    {
      provide: ENVIRONMENT_CONFIG,
      useValue: environment,
    },

    // Interceptors
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: SharedUserContextInterceptor,
      multi: true,
    },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: ApiSandboxInterceptor,
      multi: true,
    },

    // Error handler
    {
      provide: 'ErrorHandler',
      useClass: AppErrorHandler,
    },
  ],
};
