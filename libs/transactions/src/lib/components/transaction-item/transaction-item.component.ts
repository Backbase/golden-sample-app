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
  TransactionsJourneyExtensionsConfig, TransactionAdditionalDetailsComponent,
} from '../../extensions';
import { ExtensionSlotDirective} from "../../extension-slot.directive";
import {interval, switchMap, map, ReplaySubject} from "rxjs";

@Component({
  selector: 'bb-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItemComponent implements OnChanges {
  private _transaction!: TransactionItem;
  private readonly transaction$$ = new ReplaySubject<TransactionItem>(1);

  @Input()
  set transaction(transaction: TransactionItem) {
    this.transaction$$.next(transaction);
    this._transaction = transaction;
  }
  get transaction(): TransactionItem {
    return this._transaction;
  }

  public amount = 0;
  public isAmountPositive = true;
  public additionsDetails?: Type<TransactionAdditionalDetailsComponent>;
  public exampleChanges$ = this.transaction$$.pipe(
    switchMap(
      (txn) => interval(2000).pipe(
        map((v) => ({
            ...txn,
            additions: {
                myAddition: `${v}`
            }
          })
        ),
      )
    )
  );

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
