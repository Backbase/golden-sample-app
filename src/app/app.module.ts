import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AvatarModule, DropdownMenuModule, IconModule, LayoutModule, LogoModule } from '@backbase/ui-ang';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { WebSdkApiModule, WebSdkModule } from '@backbase/foundation-ang/web-sdk';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MakeTransferCommunicationService } from 'transfer-journey';
import { TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE } from 'transactions-journey';

import { JourneyCommunicationService } from './services/journey-communication.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://www.angular.at/api'],
        sendAccessToken: true,
      },
    }),
    HttpClientModule,
    EntitlementsModule,
    DropdownMenuModule,
    IconModule,
    LayoutModule,
    LogoModule,
    NgbDropdownModule,
    AvatarModule,
    WebSdkApiModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],
  providers: [
    ...environment.mockProviders,
    AuthGuard,
    {
      provide: MakeTransferCommunicationService,
      useExisting: JourneyCommunicationService,
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
