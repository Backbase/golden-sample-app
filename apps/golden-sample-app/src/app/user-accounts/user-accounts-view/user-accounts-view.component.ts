import { Component, Inject, Optional } from '@angular/core';
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
  standalone: false,
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;

  private readonly defaultTranslations: UserAccountsTranslations =
    userAccountsTranslations;
  public readonly translations: UserAccountsTranslations;

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Inject(USER_ACCOUNTS_TRANSLATIONS)
    private readonly overridingTranslations: Partial<UserAccountsTranslations>,
    @Optional() private readonly tracker?: Tracker
  ) {
    
    
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations ?? {}).map(([key, value]) => [
          key,
          value ?? this.defaultTranslations[key],
        ])
      ),
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
