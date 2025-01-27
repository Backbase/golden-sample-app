import { InjectionToken } from '@angular/core';

export const ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS =
  new InjectionToken<Translations>('ach_positive_pay_rule_form_translations');
export interface Translations {
  [key: string]: string;
}
