import { Component, Inject, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import {
  AddToFavoritesTrackerEvent,
  RemoveFromFavoritesTrackerEvent,
} from '../../model/tracker-events';
import { Translations, USER_ACCOUNTS_TRANSLATIONS } from './translations.provider';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;

  public readonly translations: Translations = {
    'app.userAccountsView.header':
      this.overridingTranslations['app.userAccountsView.header'] ||
      $localize`User accounts header - 'User accounts'|This string is used as the
          header for the user accounts view page. It is presented to the user as
          the title of the page when they view their user accounts. This header
          is located at the top of the user accounts view
          page.@@app.userAccountsView.header:User accounts`,
    'app.userAccountsView.balanceLabel':
      this.overridingTranslations['app.userAccountsView.balanceLabel'] ||
      $localize`User account available balance label - 'Available balance'|This
              string is used as the label for the available balance field in the
              user accounts view. It is presented to the user to indicate the
              available balance of their account. This label is located in the
              body section of the user accounts view
              page.@@app.userAccountsView.balanceLabel:Available balance`,
    'user-accounts.view-transactions':
      this.overridingTranslations['user-accounts.view-transactions'] ||
      $localize`Label for View Transactions link - 'View Transactions'|This string
              is used as the label for a link that navigates to the transactions
              page. It is presented to the user as a link to view transactions
              related to a specific account. This label is located in the body
              section of the user accounts view
              page.@@user-accounts.view-transactions:View Transactions`,
    'user-accounts.add-favorites':
      this.overridingTranslations['user-accounts.add-favorites'] ||
      $localize`Label for Add to Favorites link - 'Add to Favorites'|This string
                is used as the label for a link that adds an account to the
                user's favorites. It is presented to the user as a link to mark
                an account as a favorite. This label is located in the body
                section of the user accounts view
                page.@@user-accounts.add-favorites:Add to Favorites`,
    'user-accounts.remove-favorites':
      this.overridingTranslations['user-accounts.remove-favorites'] ||
      $localize`Label for Remove from Favorites link - 'Remove from
                Favorites'|This string is used as the label for a link that
                removes an account from the user's favorites. It is presented to
                the user as a link to unmark an account as a favorite. This
                label is located in the body section of the user accounts view
                page.@@user-accounts.remove-favorites:Remove from Favorites`,
  };

  constructor(
    private readonly arrangementsService: ArrangementsService,
    @Inject(USER_ACCOUNTS_TRANSLATIONS)
    private overridingTranslations: Translations,
    @Optional() private readonly tracker?: Tracker
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
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
