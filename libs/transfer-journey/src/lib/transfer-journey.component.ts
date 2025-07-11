import { Component, inject } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase/transfer-journey/internal/data-access';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
  standalone: false,
})
export class TransferJourneyComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = $localize`:A message for Repeat Transfer Alert@@transfer.repeat.message:Making Repeated Transfer for ${this.accountName}`;
}
