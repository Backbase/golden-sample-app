import { InjectionToken } from '@angular/core';

export const TRANSFER_JOURNEY_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transfer_journey_translations'
  );
export interface Translations {
  [key: string]: string;
}
