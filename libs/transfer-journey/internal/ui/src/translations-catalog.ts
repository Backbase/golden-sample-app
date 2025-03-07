import { InjectionToken } from '@angular/core';
import { TranslationRecord } from '@backbase-gsa/shared-translations';

export const TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS =
  new InjectionToken<TransferJourneyMakeTransferFormTranslations>(
    'transfer_journey_make_transfter_form_translations'
  );
export interface TransferJourneyMakeTransferFormTranslations
  extends TranslationRecord {
  'transfer.form.fromAccount.label': string;
  'transfer.form.toAccount.label': string;
  'transfer.form.toAccount.placeholder': string;
  'transfer.form.toAccount.error.required': string;
  'transfer.form.amount.label': string;
  'transfer.form.amount.error.required': string;
  'transfer.form.submit.text': string;
}

export const transferJourneyMakeTransferFormTranslations: TransferJourneyMakeTransferFormTranslations =
  {
    'transfer.form.fromAccount.label': $localize`:From account label - 'From account'|This string is used as the label for the
        'From Account' field in the transfer form. It is presented to the user when
        they need to specify the source account for the transfter. This label is
        located in the transfer form layout@@transfer.form.fromAccount.label:From account`,
    'transfer.form.toAccount.label': $localize`:To account label - 'To Account'|This string is used as the label for
          the 'To Account' field in the transfer form. It is presented to the
          user when they need to specify the destination account for the
          transfer. This label is located in the transfer form
          layout.@@transfer.form.toAccount.label:To account`,
    'transfer.form.toAccount.placeholder': $localize`:From account placeholder - 'type an account name'|This string is used
          as the placeholder for the 'From Account' field in the transfer form.
          It is presented to the user when they need to type the name of the
          account from which the transfer will be made. This placeholder is
          located in the transfer form
          layout.@@transfer.form.toAccount.placeholder:type an account name`,
    'transfer.form.toAccount.error.required': $localize`:To account required error message - 'Required field'|This string
              is used as the error message for the 'To Account' field in the
              transfer form when the field is required but not filled. It is
              presented to the user when they need to fill in the 'To Account'
              field. This error message is located in the transfer form
              layout.@@transfer.form.toAccount.error.required:Required field`,
    'transfer.form.amount.label': $localize`:Amount label - 'Amount'|This string is used as the label for the
      'Amount' field in the transfer form. It is presented to the user when
      they need to specify the amount to be transferred. This label is
      located in the transfer form layout@@transfer.form.amount.label:Amount`,
    'transfer.form.amount.error.required': $localize`:Amount required error - 'Required field'|This string
              is used as the error message for the 'Amount' field in the
              transfer form when the field is required but not filled. It is
              presented to the user when they need to fill in the 'Amount'
              field. This error message is located in the transfer form
              layout.@@transfer.form.amount.error.required:Required field`,
    'transfer.form.submit.text': $localize`:Submit button label - 'Submit'|This string is used as the label for the
      'Submit' button in the transfer form. It is presented to the user as the button to be
      pressed when the data in form is ready to make a transfer. This label is
      located in the transfer form layout@@transfer.form.submit.text:Submit`,
  };

export const TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS =
  new InjectionToken<TransferJourneyMakeTransferSummaryTranslations>(
    'transfer_journey_make_transfer_summary_translations'
  );
export interface TransferJourneyMakeTransferSummaryTranslations
  extends TranslationRecord {
  'transfer.summary.heading.label': string;
  'transfer.summary.account.description.label': string;
  'transfer.summary.amount.description.label': string;
  'transfer.summary.submit.text': string;
  'transfer.summary.close.text': string;
}
export const transferJourneyMakeTransferSummaryTranslations: TransferJourneyMakeTransferSummaryTranslations =
  {
    'transfer.summary.heading.label': $localize`:Summary heading label - 'Are you sure to send out this transfer'|This string is used as the label for the
header of the summary's transfer in the summary of the transfer before proceeding with it. It is presented to the user when
the user needs to confirm if the details of the transfer are correct. This label is
located in the summary for make a transfer layout@@transfer.summary.heading.label:Are you sure to send out this transfer`,
    'transfer.summary.account.description.label': $localize`:Summary account description label - 'it will be send to account'|This string is used as the label for the
  account description label in the summary of the transfer before proceeding with it. It is presented to the user when
  the user needs to confirm if the details of the transfer are correct. This label is
  located in the summary for make a transfer layout@@transfer.summary.account.description.label:it will be send to account`,
    'transfer.summary.amount.description.label': $localize`:Summary amount description label - 'With amount of'|This string is used as the label for the
  amount description label in the summary of the transfer before proceeding with it. It is presented to the user when
  the user needs to confirm if the details of the transfer are correct. This label is
  located in the summary for make a transfer layout@@transfer.summary.amount.description.label:With amount of`,
    'transfer.summary.submit.text': $localize`:Summary Submit button label - 'Submit'|This string is used as the label for the
  'Submit' button in the transfer summary form. It is presented to the user as the button to be
  pressed when the data in form is ready to make a transfer. This label is
  located in the make a transfer summary form layout@@transfer.summary.submit.text:Submit`,
    'transfer.summary.close.text': $localize`:Summary Close button label - 'Close'|This string is used as the label for the
  'Close' button in the transfer summary form. It is presented to the user as the button to be
  pressed to close the modal and cancel the transfer. This label is
  located in the make a transfer summary form layout@@transfer.summary.close.text:Close`,
  };
