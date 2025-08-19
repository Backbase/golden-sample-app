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
    // Use environment files for providers that vary between environments
    ...environment.providers,

    // Other providers here are common to all environments
    { provide: OAuthStorage, useValue: localStorage },
    provideLocales(['en-US', 'nl-NL']),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideEntitlements(),
    provideStore(),
    provideEffects([]),

    importProvidersFrom(
      // Need to also import the providers from the NgRx modules
      // until all child features are migrated to standalone
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
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
