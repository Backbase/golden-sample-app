import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProductSummaryItem } from '@backbase/data-ang/arrangements';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '../../../constants/dynamic-translations';

@Component({
  selector: 'bb-ach-positive-pay-rule-form',
  templateUrl: './ach-positive-pay-rule-form.component.html',
})
export class AchPositivePayRuleFormComponent {
  @Input() form!: FormGroup;

  @Input() accounts: ProductSummaryItem[] = [];

  @Output() selectAccountId: EventEmitter<ProductSummaryItem> =
    new EventEmitter<ProductSummaryItem>();

  readonly paymentTypes = [
    ACH_POSITIVE_PAY_TRANSLATIONS.creditPaymentType,
    ACH_POSITIVE_PAY_TRANSLATIONS.debitPaymentType,
  ];

  // Disabling ESLint for throwing error on empty Object property, which is a type sent by Account Selector output.
  // eslint-disable-next-line @typescript-eslint/ban-types
  onCheckingAccountSelect(selectedAccount: ProductSummaryItem | {}) {
    this.selectAccountId.emit(selectedAccount as ProductSummaryItem);
  }
}
