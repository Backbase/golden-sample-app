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
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CONDITIONS, PAGE_CONFIG, SET_LOCALE } from '@backbase/foundation-ang/web-sdk';
import { triplets } from './services/entitlementsTriplets';
import { LocaleSelectorComponent } from './components/locale-selector.component';

const buildEntitlementsByUser = (userPermissions: Record<string, boolean>): (triplet: string) => Promise<boolean> => (triplet: string) => new Promise((resolve) => {
  Object.keys(userPermissions).forEach((key) => {
    if (triplet === key) {
      resolve(userPermissions[key]);
    }
  });
});
@NgModule({
  declarations: [ AppComponent, LocaleSelectorComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    EntitlementsModule,
    DropdownMenuModule,
    IconModule,
    LayoutModule,
    LogoModule,
    NgbDropdownModule,
    AvatarModule,
    FormsModule,
    DropdownSingleSelectModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    OAuthModule.forRoot(),
  ],
  providers: [
    ...environment.mockProviders,
    AuthGuard,
    { provide: AuthConfig, useValue: authConfig },
    {
      provide: OAuthModuleConfig,
      useValue: {
        resourceServer: {
          allowedUrls: [ 'http://www.angular.at/api' ],
          sendAccessToken: true,
        },
      },
    },
    { provide: OAuthStorage, useFactory: () => localStorage },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ OAuthService ],
      useFactory: (oAuthService: OAuthService) => () => oAuthService.loadDiscoveryDocumentAndTryLogin()
    },
    {
      provide: SET_LOCALE,
      useFactory: (cookie: CookieService) => (locale: string) => {
        cookie.set('bb-locale', locale);
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          headers: {},
          body: '',
        });
      },
      deps:[CookieService],
    },
    {
      provide: PAGE_CONFIG,
      useFactory: (cookie: CookieService) => {
        const localeCookie = cookie.get('bb-locale');
        const locale = localeCookie ? localeCookie : 'en-US';
        return {
          ...environment.pageConfig,
          locale,
        }
      },
      deps:[CookieService],
    },
    {
      provide: CONDITIONS,
      useFactory: () => ({
        resolveEntitlements(triplet: string) {
          return buildEntitlementsByUser({
            [triplets.canMakeLimitlessAmountTransfer]: true,
            [triplets.canViewTransactions]: true,
            [triplets.canViewTransfer]: true,
          })(triplet);
        },
      }),
      deps: []
    },
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
}
