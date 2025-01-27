import { InjectionToken } from '@angular/core';

export const TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transfer_journey_make_transfer_success_view_translations'
  );
export interface Translations {
  [key: string]: string;
}
