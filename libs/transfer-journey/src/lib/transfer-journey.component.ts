import { Component, Input } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';

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

  public repeatMessage = $localize`:A message for Repeat Transfer Alert@@transfer.repeat.message:Making Repeated Transfer for ${this.accountName}`;

  @Input()
  public readonly translations: Translations = {};
  public readonly defaultTranslations: Translations = {
    'transfer.repeat.title': $localize`:Title for Repeat Transfer Alert - 'Transfer Alert'|This string is used as the title 
      for the Repeat Transfer Alert. It is presented to the user when they are alerted about a repeat 
      transfer. This title is located in the transfer journey component.@@transfer.repeat.title:Transfer Alert`,
  };
  constructor(private route: ActivatedRoute) {
    this.translations = {
      ...this.defaultTranslations,
      ...this.translations,
    };
  }
}
