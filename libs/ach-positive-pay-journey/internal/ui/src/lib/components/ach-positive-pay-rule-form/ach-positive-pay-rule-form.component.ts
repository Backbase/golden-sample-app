import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import '@angular/localize/init';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { InputTextModule } from '@backbase/ui-ang/input-text';

import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import {
  ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS,
  AchPositivePayRuleFormTranslations,
  achPositivePayRuleFormTranslations as defaultTranslations,
} from '../../../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'bb-ach-positive-pay-rule-form',
  templateUrl: './ach-positive-pay-rule-form.component.html',
  imports: [
    AccountSelectorModule,
    DropdownSingleSelectModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class AchPositivePayRuleFormComponent extends TranslationsBase<AchPositivePayRuleFormTranslations> {
  @Input() form!: FormGroup;

  @Input() accounts: ProductSummaryItem[] = [];

  @Output() selectAccountId: EventEmitter<ProductSummaryItem> =
    new EventEmitter<ProductSummaryItem>();

  constructor(
    @Inject(ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS)
    private readonly _translations: Partial<AchPositivePayRuleFormTranslations>
  ) {
    super(defaultTranslations, _translations);
  }

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
