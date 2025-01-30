import { Component, Inject } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';
import {
  TRANSFER_JOURNEY_TRANSLATIONS,
  transferJourneyTranslations,
  TransferJourneyTranslations,
} from '../translations-catalog';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
})
export class TransferJourneyComponent {
  private readonly defaultTranslations: TransferJourneyTranslations =
    transferJourneyTranslations;
  public readonly translations: TransferJourneyTranslations;

  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = $localize`:A message for Repeat Transfer Alert@@transfer.repeat.message:Making Repeated Transfer for ${this.accountName}`;

  constructor(
    private readonly route: ActivatedRoute,
    @Inject(TRANSFER_JOURNEY_TRANSLATIONS)
    private readonly overridingTranslations: TransferJourneyTranslations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...this.overridingTranslations,
    };
  }
}
