import { AchPositivePayInterceptor } from '../app/interceptors/ach-positive-pay.interceptor';
import { AuthConfig } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { Environment } from '@backbase-gsa/shared';
import {
  ACH_POSITIVE_PAY_JOURNEY_BUNDLE, ACH_POSITIVE_PAY_JOURNEY_NAVIGATION,
  CUSTOM_PAYMENT_JOURNEY_BUNDLE, CUSTOM_PAYMENT_JOURNEY_NAVIGATION,
  TRANSACTIONS_JOURNEY_BUNDLE, TRANSACTIONS_JOURNEY_NAVIGATION, TRANSFER_JOURNEY_BUNDLE, TRANSFER_JOURNEY_NAVIGATION
} from '@backbase-gsa/journey-bundles';

const mockProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AchPositivePayInterceptor,
    multi: true,
  },
];

export const environment: Environment = {
  production: true,
  apiRoot: '/api',
  mockProviders,
  locales: ['en-US', 'nl-NL'],
  common: {
    designSlimMode: false,
  },
  mockEnabled: true,
  isTelemetryTracerEnabled: true,
  bbApiKey: 'a554d1b4-6514-4f33-8211-3f52a03ca142',
  telemetryCollectorURL: 'https://rum-collector.backbase.io/v1/traces',
  env: 'mock',
  journeyBundles: [
    ACH_POSITIVE_PAY_JOURNEY_BUNDLE,
    CUSTOM_PAYMENT_JOURNEY_BUNDLE,
    TRANSACTIONS_JOURNEY_BUNDLE,
    TRANSFER_JOURNEY_BUNDLE
  ],
  journeyNavigation: [
    TRANSFER_JOURNEY_NAVIGATION,
    TRANSACTIONS_JOURNEY_NAVIGATION,
    ACH_POSITIVE_PAY_JOURNEY_NAVIGATION,
    CUSTOM_PAYMENT_JOURNEY_NAVIGATION,
  ]
};

export const authConfig: AuthConfig = {
  requireHttps: false,
  showDebugInformation: true,
  logoutUrl: document.baseURI + 'logout',
};
