import { Provider } from '@angular/core';
import {
    JourneyContentConfiguration,
    JourneyContentConfigurationToken,
} from 'journey-content';
// eslint-disable-next-line
export const JourneyContentConfigProvider: Provider = {
  provide: JourneyContentConfigurationToken,
  useValue: {
    cache: true
  } as Partial<JourneyContentConfiguration>,
};