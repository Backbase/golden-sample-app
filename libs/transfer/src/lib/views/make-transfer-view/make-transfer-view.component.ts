import { Component, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../../services/make-transfer-journey-config.service';
import { Transfer } from '../../model/Account';
import { map } from 'rxjs/operators';
import { MakeTransferPermissionsService } from '../../services/make-transfer-permissions.service';
import {
  ErrorStatus,
  MakeTransferJourneyState,
  TransferLoadingStatus,
} from '../../state/make-transfer-journey-state.service';
import { TransferSubmitEvent } from '../../model/tracker-events';
import { Tracker } from '@backbase/foundation-ang/observability';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'make-transfer-view.component.html',
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
