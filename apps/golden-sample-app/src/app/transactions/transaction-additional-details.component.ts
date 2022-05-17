import { Component, Input } from "@angular/core";
import { TransactionAdditionalDetailsComponent } from "@libs/transactions";
import { TransactionItem } from "@backbase/data-ang/transactions";

@Component({
    styleUrls: ['./transaction-additional-details.component.scss'],
    templateUrl: './transaction-additional-details.component.html'
  })
export class TransactionItemAdditionalDetailsComponent implements TransactionAdditionalDetailsComponent {
  @Input()
  context: TransactionItem | undefined;
}
