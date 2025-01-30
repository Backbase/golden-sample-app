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

  private readonly defaultTransactions: TransactionsJourneyTransactionDetailsViewTranslations =
    transactionsJourneyTransactionDetailsViewTranslations;
  public readonly translations: TransactionsJourneyTransactionDetailsViewTranslations;

  constructor(
    public route: ActivatedRoute,
    private readonly api: TransactionsHttpService,
    @Inject(TRANSACTIONS_JOURNEY_TRANSACTION_DETAILS_VIEW_TRANSLATIONS)
    private readonly overridingTranslations: TransactionsJourneyTransactionDetailsViewTranslations,
    @Optional() private readonly tracker?: Tracker
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTransactions,
      ...this.overridingTranslations,
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
        statusText: $localize`:Transaction Not Found Status Text - 'Transaction \${id} not found'|This string is used as the status text for an HTTP error response when a transaction with the specified ID is not found. It is presented to the user when they attempt to view a transaction that does not exist. This status text is located in the transaction details view component.@@transactions-journey.transaction-not-found-status-text:Transaction ${id} not found`,
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
          $localize`:Unknown Recipient - 'Unknown'|This string is used as a placeholder for the recipient field in the transaction details view when the recipient's name is not available. It is presented to the user when they view the details of a transaction that does not have a recipient's name. This placeholder is located in the transaction details view component.@@transactions-journey.unknown-recipient:Unknown`,
        status:
          transaction.billingStatus ??
          $localize`:Unknown Status - 'UNKNOWN'|This string is used as a placeholder for the status field in the transaction details view when the transaction's billing status is not available. It is presented to the user when they view the details of a transaction that does not have a billing status. This placeholder is located in the transaction details view component.@@transactions-journey.unknown-status:UNKNOWN`,
        category:
          transaction.category ??
          $localize`:Uncategorized Category - 'Uncategorized'|This string is used as a placeholder for the category field in the transaction details view when the transaction's category is not available. It is presented to the user when they view the details of a transaction that does not have a category. This placeholder is located in the transaction details view component.@@transactions-journey.uncategorized-category:Uncategorized`,
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
