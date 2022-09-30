import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ACCESS_CONTROL_BASE_PATH } from '@backbase/data-ang/accesscontrol';
import { ARRANGEMENT_MANAGER_BASE_PATH } from '@backbase/data-ang/arrangements';
import { TRANSACTIONS_BASE_PATH } from '@backbase/data-ang/transactions';
import { TemplateRegistry } from '@backbase/foundation-ang/core';
import {
  EntitlementsModule,
  ENTITLEMENTS_CONFIG,
} from '@backbase/foundation-ang/entitlements';
import { AuthService, IdentityAuthModule } from '@backbase/identity-auth';
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
import { AuthEventsHandlerService } from './auth/auth-events-handler.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LocaleSelectorModule } from './locale-selector/locale-selector.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownMenuModule,
    IconModule,
    LayoutModule,
    LogoModule,
    NgbDropdownModule,
    AvatarModule,
    EntitlementsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    OAuthModule.forRoot(),
    LocaleSelectorModule.forRoot({
      locales: environment.locales,
    }),
    ButtonModule,
    IdentityAuthModule,
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
      provide: OAuthModuleConfig,
      useValue: {
        resourceServer: {
          allowedUrls: [environment.apiRoot],
          sendAccessToken: true,
        },
      },
    },
    { provide: OAuthStorage, useFactory: () => localStorage },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        OAuthService,
        CookieService,
        AuthEventsHandlerService,
        AuthService,
      ],
      useFactory:
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
        },
    },
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
      provide: ENTITLEMENTS_CONFIG,
      useValue: {
        accessControlBasePath: `${environment.apiRoot}/access-control`,
      },
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    TemplateRegistry,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
