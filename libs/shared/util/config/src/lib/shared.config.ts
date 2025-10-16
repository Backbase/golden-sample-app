import { InjectionToken, Provider } from '@angular/core';

export interface SharedJourneyConfiguration {
  designSlimMode: boolean;
}

export const SHARED_JOURNEY_CONFIG =
  new InjectionToken<SharedJourneyConfiguration>('SHARED_JOURNEY_CONFIG');

export function provideSharedJourneyConfiguration(
  config: SharedJourneyConfiguration
): Provider {
  return {
    provide: SHARED_JOURNEY_CONFIG,
    useValue: config,
  };
}
