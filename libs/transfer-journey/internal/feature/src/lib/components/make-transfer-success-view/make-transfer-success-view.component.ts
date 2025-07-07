import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';

@Component({
  templateUrl: 'make-transfer-success-view.component.html',
  imports: [AsyncPipe, ButtonModule],
})
export class MakeTransferSuccessViewComponent {
  private readonly transferStore: MakeTransferJourneyState = inject(
    MakeTransferJourneyState
  );
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  transfer$ = this.transferStore.transfer$;

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }
}
