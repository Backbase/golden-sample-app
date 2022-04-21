import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../../services/make-transfer-journey-config.service';
import { Transfer } from '../../model/Account';
import { combineLatest, concat, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MakeTransferPermissionsService } from '../../services/make-transfer-permissions.service';
import { MakeTransferJourneyState } from '../../state/make-transfer-journey-state.service';

@Component({
  templateUrl: 'make-transfer-view.component.html',
})
export class MakeTransferViewComponent {
  title = this.route.snapshot.data['title'];

  dataWithLoading$ = concat(
    of({ loading: true, limit: 0, account: undefined }),
    combineLatest([
      this.permissions.unlimitedAmountPerTransaction$,
      this.transferStore.account$.pipe(filter((value) => !!value)),
    ]).pipe(
      map(([resolve, account]) => ({
        loading: false,
        limit: !resolve ? this.config.maxTransactionAmount : 0,
        account,
      }))
    )
  );

  submitTransfer(transfer: Transfer | undefined): void {
    if (transfer !== undefined) {
      this.transferStore.next(transfer);
      this.router.navigate(['../make-transfer-summary'], {
        relativeTo: this.route,
        state: {
          transfer,
        },
      });
    }
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transferStore: MakeTransferJourneyState,
    private readonly permissions: MakeTransferPermissionsService,
    public readonly config: MakeTransferJourneyConfiguration
  ) {
    transferStore.loadAccounts();
  }
}
