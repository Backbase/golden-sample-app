import { Component } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
})
export class TransferJourneyComponent {
  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = $localize`:Repeat Transfer Alert Message - 'Making Repeated Transfer for \${this.accountName}'|This string is used as a message for the repeat transfer alert in the transfer journey component. It is presented to the user when they are making a repeated transfer for the specified account. This message is located in the transfer journey component layout.@@transfer.repeat.message:Making Repeated Transfer for ${this.accountName}`;

  constructor(private route: ActivatedRoute) {}
}
