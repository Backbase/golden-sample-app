import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ErrorHandler,
  NgModule,
  PLATFORM_INITIALIZER,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ACCESS_CONTROL_BASE_PATH,
  ACCESS_CONTROL_BASE_PATH as ACCESS_CONTROL_V3_BASE_PATH,
} from '@backbase/accesscontrol-v3-http-ang';
import { ARRANGEMENT_MANAGER_BASE_PATH } from '@backbase/arrangement-manager-http-ang';
import {
  ENTITLEMENTS_CONFIG,
  EntitlementsModule,
} from '@backbase/foundation-ang/entitlements';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { IdentityAuthModule } from '@backbase/identity-auth';
import { TransactionSigningModule } from '@backbase/identity-auth/transaction-signing';
import {
  ActivityMonitorModule,
  AuthInterceptor,
} from '@backbase/shared/feature/auth';
import { SharedUserContextInterceptor } from '@backbase/shared/feature/user-context';
import { ENVIRONMENT_CONFIG } from '@backbase/shared/util/config';
import { TRANSACTIONS_BASE_PATH } from '@backbase/transactions-http-ang';
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
import packageInfo from 'package-json';
import { ApiSandboxInterceptor } from '../environments/api-sandbox-interceptor';
import { authConfig, environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { AppErrorHandler } from './app.error-handler';
import { LocaleSelectorModule } from './locale-selector/locale-selector.module';
import { NavigationMenuModule } from './navigation-menu/navigation-menu.module';
import { AnalyticsService } from './services/analytics.service';
import { ThemeManagerService } from './theme-switcher/theme-service';
import { ThemeSwitcherModule } from './theme-switcher/theme-switcher.component.module';

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
    NavigationMenuModule,
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
      useClass: SharedUserContextInterceptor,
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
          const initializerFn = (
            (oAuthService: OAuthService, cookieService: CookieService) =>
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
            }
          )(inject(OAuthService), inject(CookieService));
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
      provide: ENTITLEMENTS_CONFIG,
      useValue: {
        accessControlBasePath: `${environment.apiRoot}/access-control`,
      },
    },
    {
      provide: ENVIRONMENT_CONFIG,
      useValue: environment,
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
    // Make standalone config available to the app without using bootstrapApplication
    {
      provide: 'STANDALONE_CONFIG',
      useValue: appConfig,
    },
    // Setup a platform initializer to make standalone components work with NgModules
    {
      provide: PLATFORM_INITIALIZER,
      useFactory: () => {
        return () => {
          console.log(
            'Hybrid mode: NgModules + Standalone Components initialized'
          );
        };
      },
      multi: true,
    },
    ...appConfig.providers,
  ],
})
export class AppModule {}
