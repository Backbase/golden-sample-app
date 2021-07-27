import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebSdkModule } from '@backbase/foundation-ang/web-sdk';
import { environment } from '../environments/environment';
import { AvatarModule, DropdownMenuModule, IconModule } from '@backbase/ui-ang';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebSdkModule.forRoot({ ...environment, staticResourcesRoot: '' }),
    DropdownMenuModule,
    AvatarModule,
    IconModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
