import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEntitlements } from '@backbase/foundation-ang/entitlements';
import { IdentityAuthModule } from '@backbase/identity-auth';
import { TransactionSigningModule } from '@backbase/identity-auth/transaction-signing';
import { SharedUserContextInterceptor } from '@backbase/shared/feature/user-context';
import { provideLocales } from '@backbase/shared/util/app-core';
import {
  SHARED_JOURNEY_CONFIG,
  SharedJourneyConfiguration,
} from '@backbase/shared/util/config';
import { LayoutModule } from '@backbase/ui-ang/layout';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { StoreModule, provideStore } from '@ngrx/store';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app-routes';
import { AppErrorHandler } from './app.error-handler';
import { OAuthStorage } from 'angular-oauth2-oidc';

const sharedJourneyConfig: SharedJourneyConfiguration = {
  designSlimMode: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    // A note on NgRx:
    //
    // If some features in the app use NgRx modules (i.e., have not yet
    // migrated to the standalone provideState and provideEffects functions),
    // then we need to use importProvidersFrom from the NgRx "forRoot" modules
    // in addition to the standalone provideStore and provideEffects functions.
    //
    // The module imports MUST be listed BEFORE the standalone `provideStore`
    // and `provideEffects` in this providers array. The root store config
    // and any root effects must be given in the standalone functions later,
    // and NOT via the module .forRoot functions.
    //
    // Finally, the environment providers must be included AFTER the standalone
    // NgRx store and effects providers, so that if they include the store dev
    // tools provider, it is set up correctly.
    //
    // Once all child features are migrated to standalone, we can remove the
    // importProvidersFrom for the store and effects modules.
    //
    importProvidersFrom(StoreModule.forRoot(), EffectsModule.forRoot()),
    provideStore(),
    provideEffects([]),

    // Use environment files for providers that vary between environments
    ...environment.providers,

    // Other providers here are common to all environments
    { provide: OAuthStorage, useValue: localStorage },
    provideLocales(['en-US', 'nl-NL']),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideEntitlements(),

    importProvidersFrom(
      TransactionSigningModule.withConfig({}),
      IdentityAuthModule,
      LayoutModule
    ),

    {
      provide: SHARED_JOURNEY_CONFIG,
      useValue: sharedJourneyConfig,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: SharedUserContextInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
  ],
};
