import { Component, Inject } from "@angular/core";
import { AdditionDetailsData, TRANSACTION_ADDITION_DETAILS_DATA } from "@libs/transactions";

@Component({
    styleUrls: ['./transaction-additional-details.component.scss'],
    templateUrl: './transaction-additional-details.component.html'
  })
  export class TransactionItemAdditionalDetailsComponent {
    constructor(
      @Inject(TRANSACTION_ADDITION_DETAILS_DATA) public data: AdditionDetailsData
    ) {}
  }