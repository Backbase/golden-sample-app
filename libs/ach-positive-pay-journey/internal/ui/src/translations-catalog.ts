import { $localize } from '@angular/localize/init';

export interface AchPositivePayRuleFormTranslations {
  'ach-positive-pay-journey.new-blocker-rule.checking-account': string;
  'ach-positive-pay-journey.new-blocker-rule.account-selector-placeholder': string;
  'ach-positive-pay-journey.new-blocker-rule.payment-type.label': string;
  'ach-positive-pay-journey.new-blocker-rule.company-id.label': string;
  'ach-positive-pay-journey.new-blocker-rule.company-name.label': string;
  'ach-positive-pay-journey.new-blocker-rule.company-name.placeholder': string;
}
export const achPositivePayRuleFormTranslations: AchPositivePayRuleFormTranslations =
  {
    'ach-positive-pay-journey.new-blocker-rule.checking-account': $localize`:Checking Account label - 'Checking Account'|This string is used as the
          label for the Checking Account selector field in the ACH Positive Pay
          rule form. It is presented to the user when they need to select a
          checking account for the ACH Positive Pay rule. This label is located in
          the ACH Positive Pay rule form
          layout.@@ach-positive-pay-journey.new-blocker-rule.checking-account:Checking Account`,
    'ach-positive-pay-journey.new-blocker-rule.account-selector-placeholder': $localize`:Select account placeholder - 'Select an account'|This string is used as
          the placeholder text for the Account Selector field in the ACH Positive
          Pay rule form. It is presented to the user when they need to select an
          account for the ACH Positive Pay rule. This placeholder is located in
          the ACH Positive Pay rule form
          layout.@@ach-positive-pay-journey.new-blocker-rule.account-selector-placeholder:Select an account`,
    'ach-positive-pay-journey.new-blocker-rule.payment-type.label': $localize`:Payment type label - 'Payment type'|This string is used as the label
            for the blocker rule's payment type field in the ACH Positive Pay rule
            form. It is presented to the user when they need to select the payment
            type for the ACH Positive Pay rule. This label is located in the ACH
            Positive Pay rule form
            layout.@@ach-positive-pay-journey.new-blocker-rule.payment-type.label:Payment Type`,
    'ach-positive-pay-journey.new-blocker-rule.company-id.label': $localize`:Company ID label - 'Company ID'|This string is used as the label for
            the blocker rule's company ID field in the ACH Positive Pay rule form.
            It is presented to the user when they need to enter the company ID for
            the ACH Positive Pay rule. This label is located in the ACH Positive
            Pay rule form
            layout.@@ach-positive-pay-journey.new-blocker-rule.company-id.label:Company ID`,
    'ach-positive-pay-journey.new-blocker-rule.company-name.label': $localize`:Company name label- 'Company name'|This string is used as the label
            for the blocker rule's company name field in the ACH Positive Pay rule
            form. It is presented to the user when they need to enter the company
            name for the ACH Positive Pay rule. This label is located in the ACH
            Positive Pay rule form
            layout.@@ach-positive-pay-journey.new-blocker-rule.company-name.label:Company Name`,
    'ach-positive-pay-journey.new-blocker-rule.company-name.placeholder': $localize`:Enter company name placeholder - 'Enter company name'|This string is
          used as the placeholder for the company name input field in the ACH
          Positive Pay rule form. It is presented to the user when they need to
          enter the company name for the ACH Positive Pay rule. This placeholder
          is located in the ACH Positive Pay rule form
          layout.@@ach-positive-pay-journey.new-blocker-rule.company-name.placeholder:Enter company name`,
  };

export interface AchPositivePayRulesTranslations {
  'ach-positive-pay.view-rules.empty-state.title': string;
  'ach-positive-pay.view-rules.empty-state.subtitle': string;
}

export const achPositivePayRulesTranslations: AchPositivePayRulesTranslations =
  {
    'ach-positive-pay.view-rules.empty-state.title': $localize`:ACH rules list empty state title - 'No rules'|This string is used as the
        title for the empty state of the ACH rules list. It is presented to the
        user when there are no ACH rules to display. This title is located in the
        ACH rules list view.@@ach-positive-pay.view-rules.empty-state.title:No rules`,
    'ach-positive-pay.view-rules.empty-state.subtitle': $localize`:ACH rules list empty state subtitle - 'You don't have any ACH rules to be
        displayed.'|This string is used as the subtitle for the empty state of the
        ACH rules list. It is presented to the user when there are no ACH rules to
        display. This subtitle is located in the ACH rules list
        view.@@ach-positive-pay.view-rules.empty-state.subtitle:You don't have any ACH rules to be displayed.`,
  };
