import { Component, Optional } from '@angular/core';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Tracker } from '@backbase/foundation-ang/observability';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  AddToFavoritesTrackerEvent,
  RemoveFromFavoritesTrackerEvent,
} from '../../model/tracker-events';

@Component({
  selector: 'app-user-accounts-view',
  template: `
    <div class="row">
      <div class="bb-card col-lg-6">
        <div class="bb-card__header">
          <h1 class="bb-card__title" i18n="User accounts header">
            User accounts
          </h1>
        </div>
        <div
          class="bb-card__body"
          *ngIf="arrangements$ | async as arrangments; else loading"
        >
          <p>
            {arrangments.length, plural, =0 {There are no accounts} =1 {There is
            an account} other {There are {{ arrangments.length }} accounts}}:
          </p>
          <div class="bb-list">
            <div
              *ngFor="let account of arrangments"
              data-role="product"
              class="bb-list__item"
            >
              <div class="product-item">
                <div class="product-item__header">
                  <h3 class="product-item__title">{{ account.displayName }}</h3>
                  <button
                    class="product-item__favorite"
                    (click)="updateFavorite(account)"
                  >
                    {{
                      account.favorite
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'
                    }}
                  </button>
                </div>
                <div class="product-item__body">
                  <div class="product-item__balance">
                    <span class="product-item__label">Available balance</span>
                    <span class="product-item__amount">{{
                      account.availableBalance | currency : account.currency
                    }}</span>
                  </div>
                  <div class="product-item__number">
                    <span class="product-item__label">Account number</span>
                    <span class="product-item__value">{{
                      account.number
                    }}</span>
                  </div>
                </div>
                <div class="product-item__footer">
                  <a
                    [routerLink]="['/transactions']"
                    [queryParams]="{ account: account.id }"
                  >
                    View Transactions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ng-template #loading>
      <div data-role="transactions-view__loading-state-container">
        <div class="loading-indicator">Loading...</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .product-item {
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
      .product-item__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .product-item__title {
        margin: 0;
        font-size: 1.25rem;
      }
      .product-item__favorite {
        background: none;
        border: none;
        color: #0066cc;
        cursor: pointer;
      }
      .product-item__body {
        margin-bottom: 1rem;
      }
      .product-item__balance,
      .product-item__number {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .product-item__label {
        color: #666;
      }
      .product-item__amount {
        font-weight: bold;
      }
      .product-item__footer {
        border-top: 1px solid #e0e0e0;
        padding-top: 1rem;
      }
      .product-item__footer a {
        color: #0066cc;
        text-decoration: none;
      }
      .loading-indicator {
        text-align: center;
        padding: 2rem;
        color: #666;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;

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
