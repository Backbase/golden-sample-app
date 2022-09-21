import { Component } from '@angular/core';
import { MakeTransferJourneyState } from './state/make-transfer-journey-state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
})
export class TransferJourneyComponent {
  public counterPartyName = this.route.snapshot.params['counterPartyName'];
  constructor(private route: ActivatedRoute) {}
}
