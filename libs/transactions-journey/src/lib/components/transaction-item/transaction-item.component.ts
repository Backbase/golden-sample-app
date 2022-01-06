import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Transaction } from '../../model/transaction';

@Component({
  selector: 'bb-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItemComponent implements OnChanges {
  @Input() transaction!: Transaction;
  amount = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction']) {
      this.amount = this.transaction?.transaction.amountCurrency.amount ?? 0;

      if (this.transaction?.transaction.creditDebitIndicator === 'DBIT') {
        this.amount *= -1;
      }
    }
  }
}
