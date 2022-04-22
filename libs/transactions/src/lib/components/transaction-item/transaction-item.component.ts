import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
} from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { TRANSACTION_ADDITION_DETAILS } from '../../tokens';

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
  
  get additionsDetailsInputs() {
    return {
      additions: this.transaction.additions,
      merchant: this.transaction.merchant,
      counterPartyAccountNumber: this.transaction.counterPartyAccountNumber
    }
  }

  // TODO provide correct generic instead of `any`
  constructor(
    @Inject(TRANSACTION_ADDITION_DETAILS) public additionsDetails: Type<any>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction']) {
      this.amount = Number(
        this.transaction.transactionAmountCurrency.amount ?? 0
      );

      if (this.transaction.creditDebitIndicator === 'DBIT') {
        this.amount *= -1;
      }

      this.isAmountPositive = this.amount > 0;
    }
  }
}
