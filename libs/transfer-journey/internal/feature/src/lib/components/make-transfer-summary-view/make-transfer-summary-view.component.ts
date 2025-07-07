import { Component, inject, OnDestroy, Optional } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyState,
  TransferOperationStatus,
} from '@backbase/transfer-journey/internal/data-access';
import { MakeTransferSummaryComponent } from '@backbase/transfer-journey/internal/ui';

@Component({
  templateUrl: 'make-transfer-summary-view.component.html',
  imports: [AsyncPipe, MakeTransferSummaryComponent],
})
export class MakeTransferSummaryViewComponent implements OnDestroy {
  private readonly transferStore: MakeTransferJourneyState = inject(
    MakeTransferJourneyState
  );
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly externalCommunicationService: MakeTransferCommunicationService | null =
    inject(MakeTransferCommunicationService, { optional: true });
  vm$ = this.transferStore.vm$;

  private successfulOperation = this.transferStore.vm$
    .pipe(
      filter(
        ({ transferState }) =>
          transferState === TransferOperationStatus.SUCCESSFUL
      )
    )
    .subscribe(({ transfer }) => {
      if (this.externalCommunicationService && transfer) {
        this.externalCommunicationService.makeTransfer(transfer);
      } else {
        this.router.navigate(['../make-transfer-success'], {
          relativeTo: this.route,
          skipLocationChange: true,
          state: {
            transfer: transfer,
          },
        });
      }
    });

  submit(): void {
    this.transferStore.makeTransfer();
  }

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.successfulOperation.unsubscribe();
  }
}
