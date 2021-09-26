import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../../services/make-transfer-journey-config.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';
import { Transfer } from '../../model/Account';
import { combineLatest, concat, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MakeTransferPermissionsService } from '../../services/make-transfer-permissions.service';
import { MakeTransferAccountHttpService } from '../../services/make-transfer-accounts.http.service';
import { TemplateStorageService } from 'journey-content';

@Component({
  templateUrl: 'make-transfer-view.component.html',
})
export class MakeTransferViewComponent {
  title = this.route.snapshot.data.title;

  dataWithLoading$ = concat(
    of({loading: true, limit: 0, account: undefined}),
    combineLatest([
      this.permissions.unlimitedAmountPerTransaction$,
      this.accounts.currentAccount$,
    ]).pipe(map(([resolve, account]) => ({
      loading: false,
      limit: !resolve ? this.config.maxTransactionAmount : 0,
      account,
    }))),
  );

  submitTransfer(transfer: Transfer): void {
    this.transferStore.next(transfer);

    this.router.navigate(['../make-transfer-summary'], { relativeTo: this.route });
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly transferStore: MakeTransferJourneyState,
    private readonly permissions: MakeTransferPermissionsService,
    private readonly accounts: MakeTransferAccountHttpService,
    public readonly config: MakeTransferJourneyConfiguration,
    public readonly templateStorageService: TemplateStorageService,
  ) {}
}
