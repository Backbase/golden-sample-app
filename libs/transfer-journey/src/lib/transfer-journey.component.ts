import { Component, Inject } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';
import {
  getTransferRepeatMessage,
  TRANSFER_JOURNEY_TRANSLATIONS,
  transferJourneyTranslations,
  TransferJourneyTranslations,
} from '../translations-catalog';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
  standalone: false,
})
export class TransferJourneyComponent {
  public readonly translations: TransferJourneyTranslations;

  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = getTransferRepeatMessage(this.accountName);

  constructor(
    private readonly route: ActivatedRoute,
    @Inject(TRANSFER_JOURNEY_TRANSLATIONS)
    private readonly overridingTranslations: Partial<TransferJourneyTranslations>
  ) {
    this.translations = {
      ...transferJourneyTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations ?? {}).map(
          ([key, value]) => [key, value ?? transferJourneyTranslations[key]]
        )
      ),
    };
  }
}
