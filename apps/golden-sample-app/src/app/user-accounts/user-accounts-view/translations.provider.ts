import { InjectionToken } from '@angular/core';

export const USER_ACCOUNTS_TRANSLATIONS = new InjectionToken<Translations>(
  'user_accounts_translations'
);
export interface Translations {
  [key: string]: string;
}
