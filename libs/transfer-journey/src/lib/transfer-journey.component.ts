import { Component, Inject } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';
import {
  getTransferRepeatMessage,
  TRANSFER_JOURNEY_TRANSLATIONS,
  TransferJourneyTranslations,
  transferJourneyTranslations as defaultTranslations,
} from '../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
  standalone: false,
})
export class TransferJourneyComponent extends TranslationsBase<TransferJourneyTranslations> {
  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = getTransferRepeatMessage(this.accountName);

  constructor(
    private readonly route: ActivatedRoute,
    @Inject(TRANSFER_JOURNEY_TRANSLATIONS)
    private readonly _translations: Partial<TransferJourneyTranslations>
  ) {
    super(defaultTranslations, _translations);
  }
}
