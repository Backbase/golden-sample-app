import { InjectionToken } from '@angular/core';

export const TRANSACTIONS_JOURNEY_TRANSACTION_VIEW_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transactions_journey_transaction_details_view_translations'
  );
export interface Translations {
  [key: string]: string;
}
