import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface ITransactionDetails {
  id: string;
  billingStatus: string;
  category: string;
  bookingDate: string;
}
@Component({
  templateUrl: './transaction-details-view.component.html',
  selector: 'bb-transaction-details',
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
  public transactionDetails: ITransactionDetails | null = null;
  private sub: Subscription = new Subscription();
  constructor(public route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub.add(
      this.route.data.subscribe(({ myData }) => {
        if (myData) {
          this.transactionDetails = (({
            id,
            billingStatus,
            category,
            bookingDate,
          }) => ({ id, billingStatus, category, bookingDate }))(myData);
        } else {
          this.router.navigate(['/transactions']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
