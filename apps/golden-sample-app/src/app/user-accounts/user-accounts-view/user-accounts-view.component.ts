import { Component, Inject, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import {
  AddToFavoritesTrackerEvent,
  RemoveFromFavoritesTrackerEvent,
} from '../../model/tracker-events';
import {
  USER_ACCOUNTS_TRANSLATIONS,
  UserAccountsTranslations,
  userAccountsTranslations as defaultTranslations,
} from '../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
  standalone: false,
})
export class UserAccountsViewComponent extends TranslationsBase<UserAccountsTranslations> {
  public arrangements$ = this.arrangementsService.arrangements$;

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Inject(USER_ACCOUNTS_TRANSLATIONS)
    private readonly _translations: Partial<UserAccountsTranslations>,
    @Optional() private readonly tracker?: Tracker
  ) {
    super(defaultTranslations, _translations);
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
