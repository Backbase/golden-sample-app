import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Currency, TransactionItem } from '@backbase/data-ang/transactions';

export interface TransactionDetails {
  description: string;
  category: string;
  type: string;
  date: Date;
  amount: Currency;
  recepient: string;
  status: string;
}

@Component({
  templateUrl: './transaction-details-view.component.html',
  selector: 'bb-transaction-details',
})
export class TransactionDetailsComponent implements OnInit {
  public title = this.route.snapshot.data['title'];

  public transaction!: TransactionDetails;

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    const transactionItem: TransactionItem | undefined =
      this.route.snapshot.data['transaction'];

    if (!transactionItem) {
      throw new HttpErrorResponse({
        status: 404,
        statusText: $localize`Transaction ${this.route.snapshot.params['id']} not found`,
      });
    }

    this.transaction = {
      type: `${transactionItem.type} - ${transactionItem.typeGroup}`,
      recepient: transactionItem.counterPartyName ?? $localize`Unknown`,
      status: transactionItem.billingStatus ?? $localize`UNKNOWN`,
      category: transactionItem.category ?? $localize`Uncategorized`,
      amount: transactionItem.transactionAmountCurrency,
      date: new Date(transactionItem.bookingDate),
      description: transactionItem.description,
    };
  }
}
