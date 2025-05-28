import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { InputTextModule } from '@backbase/ui-ang/input-text';

import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase/ach-positive-pay-journey/internal/shared-data';

@Component({
  selector: 'bb-ach-positive-pay-rule-form',
  templateUrl: './ach-positive-pay-rule-form.component.html',
  imports: [
    AccountSelectorModule,
    DropdownSingleSelectModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
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
