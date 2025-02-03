import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { Currency, TransactionItem } from '@backbase/transactions-http-ang';
import {
  ScreenViewTrackerEventPayload,
  Tracker,
  TrackerModule,
} from '@backbase/foundation-ang/observability';
import { combineLatest, map } from 'rxjs';
import { TransactionsHttpService } from '@backbase-gsa/transactions-journey/internal/data-access';
import { TransactionDetailsTrackerEvent } from '@backbase-gsa/transactions-journey/internal/shared-data';
import { ButtonModule } from '@backbase/ui-ang/button';
import { AmountModule } from '@backbase/ui-ang/amount';
import { IconModule } from '@backbase/ui-ang/icon';
import { CommonModule } from '@angular/common';
import {
  getStatusTextFromErrorMessage,
  TRANSACTIONS_JOURNEY_TRANSACTION_DETAILS_VIEW_TRANSLATIONS,
  transactionsJourneyTransactionDetailsViewTranslations,
  TransactionsJourneyTransactionDetailsViewTranslations,
} from '../translations-catalog';

interface TransactionDetailsView {
  transferParams: Params;
  previous?: TransactionItem;
  following?: TransactionItem;
  details: {
    description: string;
    category: string;
    type: string;
    date: Date;
    amount: Currency;
    recepient: string;
    status: string;
  };
}

@Component({
  templateUrl:
    './transactions-journey-feature-transaction-details-view.component.html',
  selector: 'bb-transaction-details',
  styleUrls: [
    './transactions-journey-feature-transaction-details-view.component.scss',
  ],
  imports: [
    TrackerModule,
    ButtonModule,
    AmountModule,
    IconModule,
    RouterModule,
    CommonModule,
  ],
  standalone: true,
})
export class TransactionDetailsComponent {
  public readonly title = this.route.snapshot.data['title'];

  private readonly id$ = this.route.paramMap.pipe(
    map((params) => params.get('id'))
  );

  public readonly view$ = combineLatest({
    id: this.id$,
    transactions: this.api.transactions$,
  }).pipe(
    map(({ id, transactions = [] }) => {
      return this.getTransactionView(id ?? '', transactions);
    })
  );

  private readonly defaultTranslations: TransactionsJourneyTransactionDetailsViewTranslations =
    transactionsJourneyTransactionDetailsViewTranslations;
  public readonly translations: TransactionsJourneyTransactionDetailsViewTranslations;

  constructor(
    public route: ActivatedRoute,
    private readonly api: TransactionsHttpService,
    @Inject(TRANSACTIONS_JOURNEY_TRANSACTION_DETAILS_VIEW_TRANSLATIONS)
    private readonly overridingTranslations: Partial<TransactionsJourneyTransactionDetailsViewTranslations>,
    @Optional() private readonly tracker?: Tracker
  ) {
    
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations).map(([key, value]) => [
          key,
          value ?? this.defaultTranslations[key],
        ])
      ),
    };
  }

  getTransactionView(
    id: string,
    all: TransactionItem[]
  ): TransactionDetailsView {
    const transaction = all.find((item) => item.id === id);

    if (!transaction) {
      throw new HttpErrorResponse({
        status: 404,
        statusText: getStatusTextFromErrorMessage(id),
      });
    }

    const currentIndex = (transaction && all.indexOf(transaction)) ?? NaN;
    const previous = all[currentIndex - 1];
    const following = all[currentIndex + 1];

    const transferParams = this.getTransferParams(transaction);

    return {
      transferParams,
      previous,
      following,
      details: {
        type: `${transaction.type} - ${transaction.typeGroup}`,
        recepient:
          transaction.counterPartyName ??
          this.translations['transactions-journey.unknown-recipient'],
        status:
          transaction.billingStatus ??
          this.translations['transactions-journey.unknown-status'],
        category:
          transaction.category ??
          this.translations['transactions-journey.uncategorized-category'],
        amount: transaction.transactionAmountCurrency,
        date: new Date(transaction.bookingDate),
        description: transaction.description,
      },
    };
  }

  getTransferParams(transactionItem: TransactionItem): Params {
    const params: Params = {
      amount: parseFloat(transactionItem.transactionAmountCurrency.amount),
    };

    if (transactionItem.counterPartyName) {
      params['accountName'] = transactionItem.counterPartyName;
    }

    return params;
  }

  trackNavigation($event: ScreenViewTrackerEventPayload) {
    this.tracker?.publish(new TransactionDetailsTrackerEvent($event));
  }
}
