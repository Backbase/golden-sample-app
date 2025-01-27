import { InjectionToken } from '@angular/core';

export const TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transfer_journey_make_transfer_summary_translations'
  );
export interface Translations {
  [key: string]: string;
}
