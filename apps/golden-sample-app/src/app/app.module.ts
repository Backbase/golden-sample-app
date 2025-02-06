import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHandler, NgModule, inject, provideAppInitializer, APP_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ACCESS_CONTROL_BASE_PATH,
  ACCESS_CONTROL_BASE_PATH as ACCESS_CONTROL_V3_BASE_PATH,
} from '@backbase/accesscontrol-v3-http-ang';
import { ARRANGEMENT_MANAGER_BASE_PATH } from '@backbase/arrangement-manager-http-ang';
import { TRANSACTIONS_BASE_PATH } from '@backbase/transactions-http-ang';
import {
  EntitlementsModule,
  ENTITLEMENTS_CONFIG,
} from '@backbase/foundation-ang/entitlements';
import { IdentityAuthModule } from '@backbase/identity-auth';
import { TransactionSigningModule } from '@backbase/identity-auth/transaction-signing';
import {
  INITIATE_PAYMENT_JOURNEY_CONTACT_MANAGER_BASE_PATH,
  INITIATE_PAYMENT_JOURNEY_PAYMENT_ORDER_BASE_PATH,
} from '@backbase/initiate-payment-journey-ang';
import { AvatarModule } from '@backbase/ui-ang/avatar';
import { ButtonModule } from '@backbase/ui-ang/button';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { IconModule } from '@backbase/ui-ang/icon';
import { LayoutModule } from '@backbase/ui-ang/layout';
import { LogoModule } from '@backbase/ui-ang/logo';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthService,
  OAuthStorage,
} from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { authConfig, environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppErrorHandler } from './app.error-handler';
import { AnalyticsService } from './services/analytics.service';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { LocaleSelectorModule } from './locale-selector/locale-selector.module';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { UserContextInterceptor } from './user-context/user-context.interceptor';
import { ActivityMonitorModule } from './auth/activity-monitor';
import { ApiSandboxInterceptor } from '../environments/api-sandbox-interceptor';
import packageInfo from 'package-json';
import { ThemeSwitcherModule } from './theme-switcher/theme-switcher.component.module';
import { ThemeManagerService } from './theme-switcher/theme-service';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DropdownMenuModule,
    IconModule,
    LayoutModule,
    LogoModule,
    NgbDropdownModule,
    AvatarModule,
    EntitlementsModule,
    ThemeSwitcherModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    OAuthModule.forRoot(),
    LocaleSelectorModule.forRoot({
      locales: environment.locales,
    }),
    ButtonModule,
    IdentityAuthModule,
    TransactionSigningModule,
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
    ActivityMonitorModule,
  ],
  providers: [
    ...(environment.mockProviders || []),
    { provide: AuthConfig, useValue: authConfig },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserContextInterceptor,
      multi: true,
    },
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
    environment.mockEnabled
      ? []
      : provideAppInitializer(() => {
        const initializerFn = ((oAuthService: OAuthService, cookieService: CookieService) =>
            async () => {
              // Remove this if auth cookie is not needed for the app
              oAuthService.events.subscribe(({ type }) => {
                if (type === 'token_received' || type === 'token_refreshed') {
                  // Set the cookie on the app domain
                  cookieService.set(
                    'Authorization',
                    `Bearer ${oAuthService.getAccessToken()}`
                  );
                }
              });
              await oAuthService.loadDiscoveryDocumentAndTryLogin();
            })(inject(OAuthService), inject(CookieService));
        return initializerFn();
      }),
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
      provide: INITIATE_PAYMENT_JOURNEY_PAYMENT_ORDER_BASE_PATH,
      useValue: environment.apiRoot + '/payment-order-service',
    },
    {
      provide: INITIATE_PAYMENT_JOURNEY_CONTACT_MANAGER_BASE_PATH,
      useValue: environment.apiRoot + '/contact-manager',
    },
    {
      provide: ENTITLEMENTS_CONFIG,
      useValue: {
        accessControlBasePath: `${environment.apiRoot}/access-control`,
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiSandboxInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    ThemeManagerService,
    provideHttpClient(withInterceptorsFromDi()),
    { provide: APP_ID, useValue: 'golden-sample-app' },
  ],
})
export class AppModule {}
