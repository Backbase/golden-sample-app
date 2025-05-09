import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from '@backbase-gsa/transactions-journey';

@Component({
  selector: 'bb-custom-txn-info',
  styleUrls: ['./transaction-additional-details.component.scss'],
  templateUrl: './transaction-additional-details.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class TransactionItemAdditionalDetailsComponent
  implements TransactionAdditionalDetailsComponent
{
  @Input()
  context: TransactionAdditionalDetailsContext | undefined;
}
