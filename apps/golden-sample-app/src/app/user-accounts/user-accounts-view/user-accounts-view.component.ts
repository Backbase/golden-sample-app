import { Component, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import { AddtoFavoritesTrackerEvent } from '../../model/tracker-events';
@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Optional() private readonly tracker?: Tracker
  ) {}

  addTofavorites(account: ProductSummaryItem) {
    const event = new AddtoFavoritesTrackerEvent({
      accountId: account?.id,
      accountName: account?.name,
    });
    this.tracker?.publish(event);
    account.favorite = true;
  }
}
