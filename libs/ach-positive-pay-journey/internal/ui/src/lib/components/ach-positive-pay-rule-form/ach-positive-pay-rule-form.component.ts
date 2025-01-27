import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { InputTextModule } from '@backbase/ui-ang/input-text';

import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS, Translations } from './translations.provider';

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
export class AchPositivePayRuleFormComponent {
  @Input() form!: FormGroup;

  @Input() accounts: ProductSummaryItem[] = [];

  @Output() selectAccountId: EventEmitter<ProductSummaryItem> =
    new EventEmitter<ProductSummaryItem>();

  public readonly translations: Translations = {
    'ach-positive-pay-journey.new-blocker-rule.checking-account':
      this.overridingTranslations[
        'ach-positive-pay-journey.new-blocker-rule.checking-account'
      ] ||
      $localize`:Checking Account label - 'Checking Account'|This string is used as the
        label for the Checking Account selector field in the ACH Positive Pay
        rule form. It is presented to the user when they need to select a
        checking account for the ACH Positive Pay rule. This label is located in
        the ACH Positive Pay rule form
        layout.@@ach-positive-pay-journey.new-blocker-rule.checking-account:Checking Account`,
    'ach-positive-pay-journey.new-blocker-rule.account-selector-placeholder':
      this.overridingTranslations[
        'ach-positive-pay-journey.new-blocker-rule.account-selector-placeholder'
      ] ||
      $localize`:Select account placeholder - 'Select an account'|This string is used as
        the placeholder text for the Account Selector field in the ACH Positive
        Pay rule form. It is presented to the user when they need to select an
        account for the ACH Positive Pay rule. This placeholder is located in
        the ACH Positive Pay rule form
        layout.@@ach-positive-pay-journey.new-blocker-rule.account-selector-placeholder:Select an account`,
    'ach-positive-pay-journey.new-blocker-rule.payment-type.label':
      this.overridingTranslations[
        'ach-positive-pay-journey.new-blocker-rule.payment-type.label'
      ] ||
      $localize`:Payment type label - 'Payment type'|This string is used as the label
          for the blocker rule's payment type field in the ACH Positive Pay rule
          form. It is presented to the user when they need to select the payment
          type for the ACH Positive Pay rule. This label is located in the ACH
          Positive Pay rule form
          layout.@@ach-positive-pay-journey.new-blocker-rule.payment-type.label:Payment Type`,
    'ach-positive-pay-journey.new-blocker-rule.company-id.label':
      this.overridingTranslations[
        'ach-positive-pay-journey.new-blocker-rule.company-id.label'
      ] ||
      $localize`:Company ID label - 'Company ID'|This string is used as the label for
          the blocker rule's company ID field in the ACH Positive Pay rule form.
          It is presented to the user when they need to enter the company ID for
          the ACH Positive Pay rule. This label is located in the ACH Positive
          Pay rule form
          layout.@@ach-positive-pay-journey.new-blocker-rule.company-id.label:Company ID`,
    'ach-positive-pay-journey.new-blocker-rule.company-name.label':
      this.overridingTranslations[
        'ach-positive-pay-journey.new-blocker-rule.company-name.label'
      ] ||
      $localize`:Company name label- 'Company name'|This string is used as the label
          for the blocker rule's company name field in the ACH Positive Pay rule
          form. It is presented to the user when they need to enter the company
          name for the ACH Positive Pay rule. This label is located in the ACH
          Positive Pay rule form
          layout.@@ach-positive-pay-journey.new-blocker-rule.company-name.label:Company Name`,
    'ach-positive-pay-journey.new-blocker-rule.company-name.placeholder':
      this.overridingTranslations[
        'ach-positive-pay-journey.new-blocker-rule.company-name.placeholder'
      ] ||
      $localize`:Enter company name placeholder - 'Enter company name'|This string is
        used as the placeholder for the company name input field in the ACH
        Positive Pay rule form. It is presented to the user when they need to
        enter the company name for the ACH Positive Pay rule. This placeholder
        is located in the ACH Positive Pay rule form
        layout.@@ach-positive-pay-journey.new-blocker-rule.company-name.placeholder:Enter company name`,
  };

  constructor(
    @Inject(ACH_POSITIVE_PAY_RULE_FORM_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
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
