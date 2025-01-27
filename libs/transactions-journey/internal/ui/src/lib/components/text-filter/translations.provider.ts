import { InjectionToken } from '@angular/core';

export const TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transactions_journey_text_filter_translations'
  );
export interface Translations {
  [key: string]: string;
}
