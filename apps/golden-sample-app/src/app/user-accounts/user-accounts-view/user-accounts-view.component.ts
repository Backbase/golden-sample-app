import { Component, Inject, InjectionToken, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import {
  AddToFavoritesTrackerEvent,
  RemoveFromFavoritesTrackerEvent,
} from '../../model/tracker-events';
import {
  userAccountsTranslations,
  UserAccountsTranslations,
  USER_ACCOUNTS_TRANSLATIONS,
} from '../translations-catalog';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;

  private readonly defaultTranslations: UserAccountsTranslations =
    userAccountsTranslations;
  public readonly translations: UserAccountsTranslations;

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Inject(USER_ACCOUNTS_TRANSLATIONS)
    private readonly overridingTranslations: UserAccountsTranslations,
    @Optional() private readonly tracker?: Tracker
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...this.overridingTranslations,
    };
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
