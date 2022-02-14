import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';

@Component({
  selector: 'bb-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItemComponent implements OnChanges {
  @Input() transaction!: TransactionItem;
  public amount = 0;
  public isAmountPositive = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction']) {
      this.amount = Number(this.transaction.transactionAmountCurrency.amount ?? 0);

      if (this.transaction.creditDebitIndicator === 'DBIT') {
        this.amount *= -1;
      }

      this.isAmountPositive = this.amount > 0;
    }
  }
}
