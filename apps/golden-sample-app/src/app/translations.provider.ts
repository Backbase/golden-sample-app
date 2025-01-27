import { InjectionToken } from '@angular/core';

export const APP_TRANSLATIONS = new InjectionToken<Translations>(
  'app_translations'
);
export interface Translations {
  [key: string]: string;
}
