import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
} from '@angular/core';
import { TransactionItem } from '@backbase/transactions-http-ang';
import { ViewExtensionDirective } from '@backbase/ui-ang/view-extensions';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
  TransactionAdditionalDetailsComponent,
  TransactionAdditionalDetailsContext,
} from '../../extensions';
import { AmountModule } from '@backbase/ui-ang/amount';
import { CommonModule } from '@angular/common';
import { IconMap } from '@backbase/transactions-journey/internal/shared-data';
import { RouterModule } from '@angular/router';

@Directive({
  selector: '[bbTransactionsItemAdditions]',
  standalone: true,
})
export class TransactionItemAdditionalDetailsDirective extends ViewExtensionDirective<TransactionAdditionalDetailsContext> {}

@Component({
  selector: 'bb-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AmountModule,
    TransactionItemAdditionalDetailsDirective,
    CommonModule,
    RouterModule,
  ],
})
export class TransactionItemComponent implements OnChanges {
  @Input()
  public transaction!: TransactionItem;
  @Input()
  public categoryName: string | undefined;

  private readonly extensionsConfig: TransactionsJourneyExtensionsConfig =
    inject(TRANSACTION_EXTENSIONS_CONFIG);
  public iconName = 'default';
  public amount = 0;
  public isAmountPositive = true;
  public additionsDetails?: Type<TransactionAdditionalDetailsComponent>;
  public additionsDetailsContext?: TransactionAdditionalDetailsContext;

  constructor() {
    this.additionsDetails =
      this.extensionsConfig.transactionItemAdditionalDetails;
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
      this.additionsDetailsContext = {
        merchant: this.transaction.merchant,
        additions: this.transaction.additions,
        counterPartyAccountNumber: this.transaction.counterPartyAccountNumber,
      };
    }
    this.iconName =
      IconMap[this.categoryName?.toLowerCase().replace(/\s/g, '') ?? 'default'];
  }
}
