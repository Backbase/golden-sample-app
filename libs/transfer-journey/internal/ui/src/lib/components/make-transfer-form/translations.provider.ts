import { InjectionToken } from '@angular/core';

export const TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transfer_journey_make_transfter_form_translations'
  );
export interface Translations {
  [key: string]: string;
}
