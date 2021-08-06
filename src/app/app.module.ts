import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AvatarModule, DropdownMenuModule, IconModule } from '@backbase/ui-ang';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [ 'http://www.angular.at/api' ],
        sendAccessToken: true,
      },
    }),
    HttpClientModule,
    EntitlementsModule,
    DropdownMenuModule,
    AvatarModule,
    IconModule,
  ],
  providers: [ ...environment.mockProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
