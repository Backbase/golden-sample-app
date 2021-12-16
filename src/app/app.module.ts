import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authConfig, environment } from '../environments/environment';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthConfig, OAuthModule, OAuthModuleConfig, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';
import { IconModule } from '@backbase/ui-ang/icon';
import { LayoutModule } from '@backbase/ui-ang/layout';
import { LogoModule } from '@backbase/ui-ang/logo';
import { AvatarModule } from '@backbase/ui-ang/avatar';
import { WebSdkModule } from '@backbase/foundation-ang/web-sdk';
import { LocaleSelectorModule } from './locale-selector/locale-selector.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    EntitlementsModule,
    DropdownMenuModule,
    IconModule,
    LayoutModule,
    LogoModule,
    NgbDropdownModule,
    AvatarModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    OAuthModule.forRoot(),
    LocaleSelectorModule.forRoot({
      locales: environment.locales,
    }),
    WebSdkModule.forRoot({
      apiRoot: environment.apiRoot,
    })
  ],
  providers: [
    ...environment.mockProviders,
    AuthGuard,
    { provide: AuthConfig, useValue: authConfig },
    {
      provide: OAuthModuleConfig,
      useValue: {
        resourceServer: {
          allowedUrls: [ environment.apiRoot ],
          sendAccessToken: true,
        },
      },
    },
    { provide: OAuthStorage, useFactory: () => localStorage },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ OAuthService ],
      useFactory: (oAuthService: OAuthService) => () => {
        return oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
          return oAuthService.setupAutomaticSilentRefresh();
        });
      }
    }
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
}
