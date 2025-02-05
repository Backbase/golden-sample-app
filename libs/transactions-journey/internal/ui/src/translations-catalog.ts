import { InjectionToken } from '@angular/core';
import { TranslationRecord } from '@backbase-gsa/shared-translations';

export const TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS =
  new InjectionToken<TransactionsJourneyTextFilterTranslations>(
    'transactions_journey_text_filter_translations'
  );
export interface TransactionsJourneyTextFilterTranslations
  extends TranslationRecord {
  'transaction.form.filter.aria-label': string;
  'transaction.form.filter.placeholder': string;
}
export const transactionsJourneyTextFilterTranslations: TransactionsJourneyTextFilterTranslations =
  {
    'transaction.form.filter.aria-label': $localize`:Filter transaction aria label - 'filter transactions'|This string is used as
    the aria-label for the filter transactions input field. It is presented to
    the user as an accessibility feature to describe the purpose of the input
    field. This aria-label is located in the text filter
    component.@@transaction.form.filter.aria-label:filter transactions`,
    'transaction.form.filter.placeholder': $localize`:Filter transaction placeholder - 'filter transactions by type'|This string
    is used as the placeholder text for the filter transactions input field. It
    is presented to the user to indicate that they can filter transactions by
    type. This placeholder is located in the text filter
    component.@@transaction.form.filter.placeholder:filter transactions by type`,
  };
