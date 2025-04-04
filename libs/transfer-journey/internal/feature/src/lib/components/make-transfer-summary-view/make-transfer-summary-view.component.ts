import { Component, OnDestroy, Optional } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyState,
  TransferOperationStatus,
} from '@backbase-gsa/transfer-journey/internal/data-access';
import { MakeTransferSummaryComponent } from '@backbase-gsa/transfer-journey/internal/ui';

@Component({
  templateUrl: 'make-transfer-summary-view.component.html',
  imports: [NgIf, AsyncPipe, MakeTransferSummaryComponent],
  standalone: true,
})
export class MakeTransferSummaryViewComponent implements OnDestroy {
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

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Optional()
    private externalCommunicationService: MakeTransferCommunicationService
  ) {}

  ngOnDestroy(): void {
    this.successfulOperation.unsubscribe();
  }
}
