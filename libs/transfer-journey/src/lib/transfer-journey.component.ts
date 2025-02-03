import { Component, Input } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';
import {
  getTransferRepeatMessage,
  transferJourneyTranslations,
  TransferJourneyTranslations,
} from '../translations-catalog';
interface Translations {
  [key: string]: string;
}
@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
})
export class TransferJourneyComponent {
  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = getTransferRepeatMessage(this.accountName);

  @Input()
  public readonly translations: TransferJourneyTranslations =
    transferJourneyTranslations;
  constructor(private route: ActivatedRoute) {}
}
