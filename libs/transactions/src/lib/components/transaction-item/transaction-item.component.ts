import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { AdditionalDetailsContext } from '../../directives/transaction-additional-details.directive';
import { ExtensionTemplatesService } from '../../services/extension-templates.service';

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
  public additionsDetailsTpl = this.extensionTemplateService.additionalDetailsTemplate;
  
  get additionsDetailsContext(): AdditionalDetailsContext {
    return {
      additions: this.transaction.additions,
      merchant: this.transaction.merchant,
      counterPartyAccountNumber: this.transaction.counterPartyAccountNumber
    }
  }

  constructor(private readonly extensionTemplateService: ExtensionTemplatesService) {}
  
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
