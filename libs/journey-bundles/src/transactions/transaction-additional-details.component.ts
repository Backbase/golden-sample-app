import { Component, Input } from '@angular/core';
import {
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from '@backbase-gsa/transactions-journey';

@Component({
  selector: 'backbase-custom-txn-info',
  styleUrls: ['./transaction-additional-details.component.scss'],
  templateUrl: './transaction-additional-details.component.html',
})
export class TransactionItemAdditionalDetailsComponent
  implements TransactionAdditionalDetailsComponent
{
  @Input()
  context: TransactionAdditionalDetailsContext | undefined;
}
