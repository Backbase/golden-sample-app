import { Component } from '@angular/core';
import { MakeTransferJourneyState } from './state/make-transfer-journey-state.service';
@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyState],
})
export class TransferJourneyComponent {}
