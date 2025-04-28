import { Component, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import {
  AddToFavoritesTrackerEvent,
  RemoveFromFavoritesTrackerEvent,
} from '../model/tracker-events';
@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
  standalone: false,
})
export class UserAccountsViewComponent {
  public arrangements$;

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.arrangements$ = this.arrangementsService.arrangements$;
  }

  updateFavorite(account: ProductSummaryItem) {
    const accountObj = {
      accountId: account.id,
      accountName: account.name,
    };
    const event = !account.favorite
      ? new AddToFavoritesTrackerEvent({ ...accountObj })
      : new RemoveFromFavoritesTrackerEvent({ ...accountObj });
    this.tracker?.publish(event);
    account.favorite = !account.favorite;
  }
}
