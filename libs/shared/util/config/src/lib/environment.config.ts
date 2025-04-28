import { InjectionToken, Provider } from '@angular/core';

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
  apiSandboxKey?: string;
  isTelemetryTracerEnabled?: boolean;
  bbApiKey?: string;
  telemetryCollectorURL?: string;
  env?: string;
}

export const ENVIRONMENT_CONFIG = new InjectionToken<Environment>(
  'ENVIRONMENT_CONFIG'
);
