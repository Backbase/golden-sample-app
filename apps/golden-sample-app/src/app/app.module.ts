import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EntitlementsModule, ENTITLEMENTS_CONFIG } from '@backbase/foundation-ang/entitlements';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthConfig, OAuthModule, OAuthModuleConfig, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';

import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { IconModule } from '@backbase/ui-ang/icon';
import { LayoutModule } from '@backbase/ui-ang/layout';
import { LogoModule } from '@backbase/ui-ang/logo';
import { AvatarModule } from '@backbase/ui-ang/avatar';
import { ButtonModule } from '@backbase/ui-ang/button';

import { ACCESS_CONTROL_BASE_PATH } from '@backbase/data-ang/accesscontrol';
import { TRANSACTIONS_BASE_PATH } from '@backbase/data-ang/transactions';
import { ARRANGEMENT_MANAGER_BASE_PATH } from '@backbase/data-ang/arrangements';

import { authConfig, environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
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
  ],
  providers: [
    ...(environment.mockProviders || []),
    AuthGuard,
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
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [OAuthService],
      useFactory: (oAuthService: OAuthService) => () =>
        oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => oAuthService.setupAutomaticSilentRefresh()),
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
