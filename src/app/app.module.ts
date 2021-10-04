import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authConfig, environment } from '../environments/environment';
import { AvatarModule, DropdownMenuModule, IconModule, LayoutModule, LogoModule } from '@backbase/ui-ang';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { WebSdkModule } from '@backbase/foundation-ang/web-sdk';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MakeTransferCommunicationService } from 'transfer-journey';
import { TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE } from 'transactions-journey';

import { JourneyCommunicationService } from './services/journey-communication.service';

import { AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc';

import { JourneyContentConfigProvider } from './config.providers';
import { JourneyContentModule } from 'journey-content';
// import { CMSApiModule } from 'wordpress-http-module-ang';

import { CMSApiModule } from 'drupal-http-module-ang';

@NgModule({
  declarations: [AppComponent],
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
    WebSdkModule.forRoot({
      features: {
        clientId: 'client',
        realm: 'realm',
      }
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    OAuthModule.forRoot(),
    CMSApiModule.forRoot(() => {
      return {
        credentials: {},
        isJsonMime: () => true,
        lookupCredential: () => '',
        selectHeaderContentType: () => '',
        selectHeaderAccept: () => '',
        basePath: 'http://localhost:3000/wp-json/wp/v2',
        password: 'test',
        username: 'test'
      };
    }),
    /** Basic configuration
    CMSApiModule,
    */
    /**
    * This configuration is for local call to Drupal using proxy */
    // CMSApiModule.forRoot(() => {
    //   return {
    //     apiKeys: {},
    //     credentials: {},
    //     isJsonMime: () => true,
    //     lookupCredential: () => '',
    //     selectHeaderContentType: () => '',
    //     selectHeaderAccept: () => '',
    //     basePath: '',
    //     password: 'test',
    //     username: 'test'
    //   };
    // }),
    /**
     * This configuration is for local calls to Wordpress CMS without using proxy
   CMSApiModule.forRoot(() => {
      return {
        credentials: {},
        isJsonMime: () => true,
        lookupCredential: () => '',
        selectHeaderContentType: () => '',
        selectHeaderAccept: () => '',
        basePath: 'http://localhost:8000/wp-json/wp/v2',
        password: 'test-user',
        username: 'J4xQ!^e&vvUWTZvu^r'
      };
    }),
    */
    /**
     * This configuration is for remote calls to Wordpress CMS without using proxy
    CMSApiModule.forRoot(() => {
      return {
        credentials: {},
        isJsonMime: () => true,
        lookupCredential: () => '',
        selectHeaderContentType: () => '',
        selectHeaderAccept: () => '',
        basePath: 'https://wordpress.devs.rnd.live.backbaseservices.com/wp-json/wp/v2'
      };
    }),
     */
    JourneyContentModule,
  ],
  providers: [
    ...environment.mockProviders,
    JourneyContentConfigProvider,
    AuthGuard,
    {
      provide: MakeTransferCommunicationService,
      useExisting: JourneyCommunicationService,
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,
    },
    { provide: AuthConfig, useValue: authConfig },
    {
      provide: OAuthModuleConfig,
      useValue: {
        resourceServer: {
          allowedUrls: ['http://www.angular.at/api'],
          sendAccessToken: true,
        },
      },
    },
    { provide: OAuthStorage, useFactory: () => localStorage },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
