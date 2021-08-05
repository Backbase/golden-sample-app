import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '../make-transfer-journey-state.service';

@Component({
  templateUrl: 'make-transfer-summary-view.component.html'
})
export class MakeTransferSummaryViewComponent {
  title = this.route.snapshot.data.title;

  submit(): void {
    this.router.navigate(['../make-transfer-success'], { relativeTo: this.route });
  }

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  constructor(
    public readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}
}
