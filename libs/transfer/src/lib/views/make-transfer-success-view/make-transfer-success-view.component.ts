import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '../../state/make-transfer-journey-state.service';

@Component({
  templateUrl: 'make-transfer-success-view.component.html',
})
export class MakeTransferSuccessViewComponent {
  transfer$ = this.transferStore.transfer$;

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}
}
