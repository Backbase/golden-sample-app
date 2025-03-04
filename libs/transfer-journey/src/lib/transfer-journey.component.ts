import { Component } from '@angular/core';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertModule } from '@backbase/ui-ang/alert';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
  standalone: true,
  imports: [CommonModule, RouterModule, AlertModule],
})
export class TransferJourneyComponent {
  public title: string = this.route.snapshot.firstChild?.data['title'] ?? '';

  public accountName: string = this.route.snapshot.params['accountName'];

  public repeatMessage = $localize`:A message for Repeat Transfer Alert@@transfer.repeat.message:Making Repeated Transfer for ${this.accountName}`;

  constructor(private route: ActivatedRoute) {}
}
