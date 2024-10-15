import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { Navigation } from '../interfaces/navigation.type';

export interface sharedJourneyConfiguration {
  designSlimMode: boolean;
}

export interface Environment {
  production: boolean;
  apiRoot: string;
  locales: string[];
  mockProviders?: Provider[];
  mockEnabled?: boolean;
  common: sharedJourneyConfiguration;
  isTelemetryTracerEnabled?: boolean;
  bbApiKey?: string;
  telemetryCollectorURL?: string;
  env?: string;
}
