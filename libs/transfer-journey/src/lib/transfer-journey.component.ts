import { Component, Inject, InjectionToken } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';

export const TRANSFER_JOURNEY_TRANSLATIONS = new InjectionToken<Translations>(
  'transfer_journey_translations'
);
export interface Translations {
  'transfer.repeat.title'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
})
export class TransferJourneyComponent {
  public readonly translations: Translations = {
    'transfer.repeat.title':
      $localize`:Title for Repeat Transfer Alert - 'Transfer Alert'|This string is used as the title 
      for the Repeat Transfer Alert. It is presented to the user when they are alerted about a repeat 
      transfer. This title is located in the transfer journey component.@@transfer.repeat.title:Transfer Alert`,
  };

  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = $localize`:A message for Repeat Transfer Alert@@transfer.repeat.message:Making Repeated Transfer for ${this.accountName}`;

  constructor(
    private route: ActivatedRoute,
    @Inject(TRANSFER_JOURNEY_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = { ...this.translations, ...this.overridingTranslations };
  }
}
