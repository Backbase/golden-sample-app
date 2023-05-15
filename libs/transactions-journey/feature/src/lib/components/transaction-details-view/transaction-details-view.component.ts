import { HttpErrorResponse } from '@angular/common/http';
import { Component, Optional } from '@angular/core';
import { ActivatedRoute, Params, RouterLink, RouterModule } from '@angular/router';
import { Currency, TransactionItem } from '@backbase/transactions-http-ang';
import {
  ScreenViewTrackerEventPayload,
  Tracker,
  TrackerModule
} from '@backbase/foundation-ang/observability';
import { combineLatest, map } from 'rxjs';
import { TransactionsHttpService } from '@backbase-gsa/internal-transactions-data-access';
import { TransactionDetailsTrackerEvent } from '@backbase/internal-transactions-shared-data';
import { ButtonModule } from '@backbase/ui-ang/button';
import { AmountModule } from '@backbase/ui-ang/amount';
import { IconModule } from '@backbase/ui-ang/icon';
import { CommonModule } from '@angular/common';

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
  templateUrl: './transaction-details-view.component.html',
  selector: 'bb-transaction-details',
  styleUrls: ['./transaction-details-view.component.scss'],
  imports: [ TrackerModule, ButtonModule, AmountModule, IconModule, RouterModule, CommonModule ],
  standalone: true
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

  constructor(
    public route: ActivatedRoute,
    private api: TransactionsHttpService,
    @Optional() private tracker?: Tracker
  ) {}

  getTransactionView(
    id: string,
    all: TransactionItem[]
  ): TransactionDetailsView {
    const transaction = all.find((item) => item.id === id);

    if (!transaction) {
      throw new HttpErrorResponse({
        status: 404,
        statusText: $localize`Transaction ${id} not found`,
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
        recepient: transaction.counterPartyName ?? $localize`Unknown`,
        status: transaction.billingStatus ?? $localize`UNKNOWN`,
        category: transaction.category ?? $localize`Uncategorized`,
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
