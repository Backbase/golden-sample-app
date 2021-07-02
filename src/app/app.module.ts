import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvatarModule, DropdownMenuModule, IconModule } from '@backbase/ui-ang';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { RouterModule } from '@angular/router';
import { BackbaseCoreModule, ItemModel } from '@backbase/foundation-ang/core';
import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';

const itemModelValue = new ItemModel(
  'golden-sample',
  {
    classId: '',
  },
  of({}),
);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    EntitlementsModule,
    DropdownMenuModule,
    AvatarModule,
    IconModule,
    BackbaseCoreModule.forRoot({}),
    RouterModule.forRoot([], { initialNavigation: 'disabled', useHash: true, relativeLinkResolution: 'legacy' }),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: false, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([]),
  ],
  providers: [
    {
      provide: ItemModel,
      useValue: itemModelValue,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
