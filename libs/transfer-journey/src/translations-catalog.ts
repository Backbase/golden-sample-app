import { InjectionToken } from '@angular/core';

export const TRANSFER_JOURNEY_TRANSLATIONS =
  new InjectionToken<TransferJourneyTranslations>(
    'transfer_journey_translations'
  );
export interface TransferJourneyTranslations {
  'transfer.repeat.title': string;
  [key: string]: string;
}
export const transferJourneyTranslations: TransferJourneyTranslations = {
  'transfer.repeat.title': $localize`:Title for Repeat Transfer Alert - 'Transfer Alert'|This string is used as the title 
      for the Repeat Transfer Alert. It is presented to the user when they are alerted about a repeat 
      transfer. This title is located in the transfer journey component.@@transfer.repeat.title:Transfer Alert`,
};
export const getTransferRepeatMessage = (accountName: string) =>
  $localize`:A message for Repeat Transfer Alert@@transfer.repeat.message:Making Repeated Transfer for ${accountName}`;
