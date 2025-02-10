import { Component, Input, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import {
  userAccountsTranslations,
  UserAccountsTranslations,
} from '../translations-catalog';
import {
  AddToFavoritesTrackerEvent,
  RemoveFromFavoritesTrackerEvent,
} from '../../model/tracker-events';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;
  private _translations: UserAccountsTranslations = {
    ...userAccountsTranslations,
  };

  @Input()
  set translations(value: Partial<UserAccountsTranslations>) {
    this._translations = { ...userAccountsTranslations, ...value };
  }

  get translations(): UserAccountsTranslations {
    return this._translations;
  }

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Optional() private readonly tracker?: Tracker
  ) {}

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
