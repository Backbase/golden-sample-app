import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
  Type,
} from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { AdditionDetailsData, TRANSACTION_ADDITION_DETAILS, TRANSACTION_ADDITION_DETAILS_DATA } from '../../extensions';

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
  additionalDetailsInjector: Injector;
  
  constructor(
    @Optional() @Inject(TRANSACTION_ADDITION_DETAILS) public additionsDetails: Type<any>,
    injector: Injector,
  ) {

    this.additionalDetailsInjector = Injector.create({
      providers: [
        { 
          provide: TRANSACTION_ADDITION_DETAILS_DATA, 
          useFactory: (): AdditionDetailsData => ({
            additions: this.transaction.additions || {},
            merchant: this.transaction.merchant,
            counterPartyAccountNumber: this.transaction.counterPartyAccountNumber
          })
        }
      ],
      parent: injector
    })
  }

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
