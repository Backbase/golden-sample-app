import { Provider } from '@angular/core';

export interface Environment {
  production: boolean;
  apiRoot: string;
  locales: string[];
  mockProviders?: Provider[];
  common: any;
}
