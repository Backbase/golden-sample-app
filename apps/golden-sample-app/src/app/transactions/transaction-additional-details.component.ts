import { Component, Input } from "@angular/core";

@Component({
    styleUrls: ['./transaction-additional-details.component.scss'],
    templateUrl: './transaction-additional-details.component.html'
  })
  export class TransactionItemAdditionalDetailsComponent {
    @Input() counterPartyAccountNumber = '';
    @Input() additions?: {[key: string]: string};
  }