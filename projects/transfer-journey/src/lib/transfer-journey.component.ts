import { Component } from '@angular/core';
import { MakeTransferJourneyConfigService } from './make-transfer-journey-config.service';

@Component({
  selector: 'lib-transfer-journey',
  templateUrl: 'transfer-journey.component.html',
  providers: [MakeTransferJourneyConfigService]
})
export class TransferJourneyComponent {
}
