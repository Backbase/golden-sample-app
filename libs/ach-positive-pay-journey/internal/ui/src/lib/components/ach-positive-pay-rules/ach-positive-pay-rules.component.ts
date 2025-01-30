import { Component, Inject, InjectionToken } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';

export const ACH_POSITIVE_PAY_RULES_TRANSLATIONS =
  new InjectionToken<Translations>('ach_positive_pay_rules_translations');
export interface Translations {
  'ach-positive-pay.view-rules.empty-state.title'?: string;
  'ach-positive-pay.view-rules.empty-state.subtitle'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'bb-ach-positive-pay-rules',
  templateUrl: './ach-positive-pay-rules.component.html',
  imports: [EmptyStateModule],
  standalone: true,
})
export class AchPositivePayRulesComponent {
  public readonly translations: Translations = {
    'ach-positive-pay.view-rules.empty-state.title':
      $localize`:ACH rules list empty state title - 'No rules'|This string is used as the
      title for the empty state of the ACH rules list. It is presented to the
      user when there are no ACH rules to display. This title is located in the
      ACH rules list view.@@ach-positive-pay.view-rules.empty-state.title:No rules`,
    'ach-positive-pay.view-rules.empty-state.subtitle':
      $localize`:ACH rules list empty state subtitle - 'You don't have any ACH rules to be
      displayed.'|This string is used as the subtitle for the empty state of the
      ACH rules list. It is presented to the user when there are no ACH rules to
      display. This subtitle is located in the ACH rules list
      view.@@ach-positive-pay.view-rules.empty-state.subtitle:You don't have any ACH rules to be displayed.`,
  };
  constructor(
    @Inject(ACH_POSITIVE_PAY_RULES_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = { ...this.translations, ...this.overridingTranslations };
  }
}
