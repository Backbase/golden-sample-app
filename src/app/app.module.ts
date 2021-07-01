import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvatarModule, DropdownMenuModule, IconModule } from '@backbase/ui-ang';
import {EntitlementsModule} from '@backbase/foundation-ang/entitlements';
import {RouterModule} from '@angular/router';
import {BackbaseCoreModule, ItemModel} from '@backbase/foundation-ang/core';
import {of} from 'rxjs';

const itemModelValue = new ItemModel('golden-sample', {
  classId: ''
}, of({}));

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EntitlementsModule,
    DropdownMenuModule,
    AvatarModule,
    IconModule,
    BackbaseCoreModule.forRoot({}),
    RouterModule.forRoot([], { initialNavigation: 'disabled', useHash: true, relativeLinkResolution: 'legacy' }),
  ],
  providers: [
    {
      provide: ItemModel,
      useValue: itemModelValue
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
