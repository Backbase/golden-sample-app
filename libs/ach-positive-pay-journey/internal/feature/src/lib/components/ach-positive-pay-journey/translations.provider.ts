import { InjectionToken } from '@angular/core';

export const ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS =
  new InjectionToken<Translations>('ach_positive_pay_journey_translations');
export interface Translations {
  [key: string]: string;
}
