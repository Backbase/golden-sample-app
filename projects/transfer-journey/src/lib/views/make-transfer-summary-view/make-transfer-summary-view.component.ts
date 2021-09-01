import { Component, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';

@Component({
  templateUrl: 'make-transfer-summary-view.component.html',
})
export class MakeTransferSummaryViewComponent {
  title = this.route.snapshot.data.title;

  submit(): void {
    if (this.externalCommunicationService && this.transferStore.currentValue) {
      this.externalCommunicationService.makeTransfer(this.transferStore.currentValue);
    } else {
      this.router.navigate(['../make-transfer-success'], { relativeTo: this.route });
    }
  }

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  constructor(
    public readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Optional() private externalCommunicationService: MakeTransferCommunicationService,
  ) {}
}
