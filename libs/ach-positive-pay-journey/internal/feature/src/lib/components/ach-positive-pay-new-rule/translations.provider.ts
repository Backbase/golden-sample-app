import { InjectionToken } from '@angular/core';

export const ACH_POSITIVE_PAY_NEW_RULE_TRANSLATIONS =
  new InjectionToken<Translations>('ach_positive_pay_new_rule_translations');
export interface Translations {
  [key: string]: string;
}
