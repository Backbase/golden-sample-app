import { Provider } from '@angular/core';

export interface sharedJourneyConfiguration {
  designSlimMode: boolean;
}

export interface Environment {
  production: boolean;
  apiRoot: string;
  locales: string[];
  mockProviders?: Provider[];
  common: sharedJourneyConfiguration;
}
