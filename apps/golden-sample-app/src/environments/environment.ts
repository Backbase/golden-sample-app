// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AchPositivePayInterceptor } from '../app/interceptors/ach-positive-pay.interceptor';
import { AuthConfig } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { Environment } from '@backbase-gsa/shared';
import {
  ACH_POSITIVE_PAY_JOURNEY_BUNDLE,
  CUSTOM_PAYMENT_JOURNEY_BUNDLE,
  TRANSACTIONS_JOURNEY_BUNDLE, TRANSFER_JOURNEY_BUNDLE
} from '@backbase-gsa/journey-bundles';

const mockProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AchPositivePayInterceptor,
    multi: true
  }
];

export const environment: Environment = {
  production: false,
  apiRoot: 'https://app.stg.sdbxaz.azure.backbaseservices.com/api',
  mockProviders,
  locales: ['en-US', 'nl-NL'],
  common: {
    designSlimMode: false
  },
  isTelemetryTracerEnabled: true,
  bbApiKey: 'a554d1b4-6514-4f33-8211-3f52a03ca142',
  telemetryCollectorURL: 'https://rum-collector.backbase.io/v1/traces',
  env: 'local',
  journeyBundles: [
    ACH_POSITIVE_PAY_JOURNEY_BUNDLE,
    CUSTOM_PAYMENT_JOURNEY_BUNDLE,
    TRANSACTIONS_JOURNEY_BUNDLE,
    TRANSFER_JOURNEY_BUNDLE
  ]
};

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer:
    'https://identity.stg.sdbxaz.azure.backbaseservices.com/auth/realms/customer',

  // URL of the SPA to redirect the user to after login
  redirectUri: document.baseURI,

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'bb-web-client',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications. (IE: does not support PKCE)
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  scope: 'openid',

  requireHttps: false,

  showDebugInformation: true,

  logoutUrl: document.baseURI + 'logout'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
