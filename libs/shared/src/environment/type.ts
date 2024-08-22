import { Provider } from '@angular/core';
import { Route } from '@angular/router';

export interface sharedJourneyConfiguration {
  designSlimMode: boolean;
}

export interface Environment {
  production: boolean;
  apiRoot: string;
  locales: string[];
  journeyBundles: Route[],
  mockProviders?: Provider[];
  mockEnabled?: boolean;
  common: sharedJourneyConfiguration;
  isTelemetryTracerEnabled?: boolean;
  bbApiKey?: string;
  telemetryCollectorURL?: string;
  env?: string;
}
