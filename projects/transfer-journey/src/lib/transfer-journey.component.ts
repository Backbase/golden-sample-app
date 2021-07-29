import { Component } from '@angular/core';
import { MakeTransferJourneyConfigService } from './make-transfer-journey-config.service';
import { MakeTransferJourneyState } from './make-transfer-journey-state.service';

@Component({
  selector: 'bb-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyConfigService, MakeTransferJourneyState]
})
export class TransferJourneyComponent {
}
