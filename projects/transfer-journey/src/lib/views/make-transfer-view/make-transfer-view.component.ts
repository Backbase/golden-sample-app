import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../../services/make-transfer-journey-config.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';
import { Account, Transfer } from '../../model/Account';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';

@Component({
  templateUrl: 'make-transfer-view.component.html'
})
export class MakeTransferViewComponent {
  accountMock: Account = {
    id: '00001',
    name: 'my account name',
    amount: 5690.76,
  };

  title = this.route.snapshot.data.title;

  submitTransfer(transfer: Transfer): void {
    this.transferStore.next(transfer);
    
    if (this.externalCommunicationService) {
      this.externalCommunicationService.makeTransfer(transfer);
    }
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transferStore: MakeTransferJourneyState,
    public readonly config: MakeTransferJourneyConfiguration,
    @Optional() private externalCommunicationService: MakeTransferCommunicationService,
  ) {
  }
}
