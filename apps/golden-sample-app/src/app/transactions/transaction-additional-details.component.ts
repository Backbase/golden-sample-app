import { Component, Input } from '@angular/core';
import {
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
  TransactionItem,
} from '@backbase-gsa/transactions-journey';

@Component({
  selector: 'app-custom-txn-info',
  styleUrls: ['./transaction-additional-details.component.scss'],
  templateUrl: './transaction-additional-details.component.html',
  standalone: false,
})
export class TransactionItemAdditionalDetailsComponent
  implements TransactionAdditionalDetailsComponent
{
  @Input()
  transaction!: TransactionItem;

  @Input()
  context: TransactionAdditionalDetailsContext | undefined;
}
