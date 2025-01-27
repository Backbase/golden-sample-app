import { InjectionToken } from '@angular/core';

export const ACH_POSITIVE_PAY_RULES_TRANSLATIONS =
  new InjectionToken<Translations>('ach_positive_pay_rules_translations');
export interface Translations {
  [key: string]: string;
}
