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
import { LocaleSelectorModule } from './locale-selector/locale-selector.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [ AppComponent ],
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
      deps: [ OAuthService, CookieService ],
      useFactory: (oAuthService: OAuthService, cookieService: CookieService) => () => {
        // Remove this if auth cookie is not needed for the app
        oAuthService.events.subscribe(e => {
          if (e.type === 'token_received' || e.type === 'token_refreshed') {
            // Set the cookie on the app domain
            cookieService.set('Authorization', `Bearer ${ oAuthService.getAccessToken() }`);
          }
        });

        return oAuthService.loadDiscoveryDocumentAndTryLogin().then(() =>
          oAuthService.setupAutomaticSilentRefresh()
        );
      }
    }
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
}
