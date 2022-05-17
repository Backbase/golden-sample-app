import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
} from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';
import {
  ΘTRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
} from '../../extensions';
import {ExtensionComponent, ExtensionSlotDirective} from "../../extension-slot.directive";

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
  public additionsDetails?: Type<ExtensionComponent<TransactionItem>>;

  constructor(
    @Inject(ΘTRANSACTION_EXTENSIONS_CONFIG) extensionsConfig: TransactionsJourneyExtensionsConfig,
  ) {
    this.additionsDetails = extensionsConfig.transactionItem;
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

@Directive({
  selector: '[bbTransactionsItemAdditions]'
})
export class TransactionItemAdditonalDetailsDirective extends ExtensionSlotDirective<TransactionItem> {}
