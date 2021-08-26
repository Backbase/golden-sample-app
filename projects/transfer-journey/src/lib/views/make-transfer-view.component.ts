import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../make-transfer-journey-config.service';
import { MakeTransferJourneyState } from '../make-transfer-journey-state.service';
import { Account, Transfer } from '../model/Account';

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
    this.router.navigate([ '../make-transfer-summary' ], { relativeTo: this.route });
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transferStore: MakeTransferJourneyState,
    public readonly config: MakeTransferJourneyConfiguration
  ) {
  }
}
