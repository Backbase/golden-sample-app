import { InjectionToken } from '@angular/core';
import { TranslationRecord } from '@backbase-gsa/shared-translations';

export const TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS =
  new InjectionToken<TransferJourneyMakeTransferSuccessViewTranslations>(
    'transfer_journey_make_transfer_success_view_translations'
  );
export interface TransferJourneyMakeTransferSuccessViewTranslations
  extends TranslationRecord {
  'transfer.success.close.text': string;
}
export const transferJourneyMakeTransferSuccessViewTranslations: TransferJourneyMakeTransferSuccessViewTranslations =
  {
    'transfer.success.close.text': $localize`:Close button label - 'Close'|This string is used as the label for the
      close button in the transfer success view. It is presented to the user
      when they want to close the success message after making a transfer. This
      label is located in the transfer success view component.
      @@transfer.success.close.text:Close`,
  };
