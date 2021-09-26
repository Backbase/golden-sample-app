import { Provider } from '@angular/core';
import {
    JourneyContentConfiguration,
    JourneyContentConfigurationToken,
} from 'journey-content';
// eslint-disable-next-line
export const JourneyContentConfigProvider: Provider = {
  provide: JourneyContentConfigurationToken,
  useValue: {
    // rootUrl: 'http://fake-rootUrl.com',
    // contentRootUrl: 'http://fake-contentRootUrl.com',
  } as Partial<JourneyContentConfiguration>,
};