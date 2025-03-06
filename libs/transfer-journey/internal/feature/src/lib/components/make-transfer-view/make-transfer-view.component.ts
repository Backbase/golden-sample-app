import { Component, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule } from '@backbase/ui-ang/alert';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { NgIf, NgSwitchCase, AsyncPipe, NgSwitch } from '@angular/common';
import {
  MakeTransferJourneyConfiguration,
  ErrorStatus,
  MakeTransferJourneyState,
  TransferLoadingStatus,
  MakeTransferPermissionsService,
} from '@backbase-gsa/transfer-journey/internal/data-access';
import {
  Transfer,
  TransferSubmitEvent,
} from '@backbase-gsa/transfer-journey/internal/shared-data';
import { MakeTransferFormComponent } from '@backbase-gsa/transfer-journey/internal/ui';

import { map } from 'rxjs/operators';
import { Tracker } from '@backbase/foundation-ang/observability';
import { Observable } from 'rxjs';

@Component({
    templateUrl: 'make-transfer-view.component.html',
    imports: [
        NgIf,
        NgSwitchCase,
        AsyncPipe,
        NgSwitch,
        AlertModule,
        MakeTransferFormComponent,
        LoadingIndicatorModule,
    ]
})
export class MakeTransferViewComponent {
  vm$ = this.transferStore.vm$;
  limit$ = this.permissions.unlimitedAmountPerTransaction$.pipe(
    map((resolve) => (!resolve ? this.config.maxTransactionAmount : 0))
  );
  errorAlert$: Observable<ErrorStatus> | null = this.vm$.pipe(
    map((data) => data.errorStatus)
  );

  submitTransfer(transfer: Transfer | undefined): void {
    if (transfer !== undefined) {
      this.tracker?.publish(new TransferSubmitEvent({}));
      this.transferStore.next(transfer);
      this.router.navigate(['../make-transfer-summary'], {
        relativeTo: this.route,
        skipLocationChange: true,
        state: {
          transfer,
        },
      });
    }
  }

  isLoading(status: TransferLoadingStatus) {
    return status === TransferLoadingStatus.LOADING;
  }

  hideErrorAlert(): void {
    this.errorAlert$ = null;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transferStore: MakeTransferJourneyState,
    private readonly permissions: MakeTransferPermissionsService,
    public readonly config: MakeTransferJourneyConfiguration,
    @Optional() private readonly tracker?: Tracker
  ) {
    transferStore.loadAccounts();
  }
}
