import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';

@Component({
    templateUrl: 'make-transfer-success-view.component.html',
    imports: [AsyncPipe, NgIf, ButtonModule]
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
