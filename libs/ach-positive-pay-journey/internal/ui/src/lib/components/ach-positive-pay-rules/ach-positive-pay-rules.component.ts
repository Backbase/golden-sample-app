import { Component, Inject } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';
import { ACH_POSITIVE_PAY_RULES_TRANSLATIONS } from './translations.provider';

@Component({
  selector: 'bb-ach-positive-pay-rules',
  templateUrl: './ach-positive-pay-rules.component.html',
  imports: [EmptyStateModule],
  standalone: true,
})
export class AchPositivePayRulesComponent {
  overridingTranslations = Inject(ACH_POSITIVE_PAY_RULES_TRANSLATIONS);

  translations = {
    'ach-positive-pay.view-rules.empty-state.title':
      this.overridingTranslations[
        'ach-positive-pay.view-rules.empty-state.title'
      ] ||
      $localize`:ACH rules list empty state title - 'No rules'|This string is used as the
      title for the empty state of the ACH rules list. It is presented to the
      user when there are no ACH rules to display. This title is located in the
      ACH rules list view.@@ach-positive-pay.view-rules.empty-state.title:No rules`,
    'ach-positive-pay.view-rules.empty-state.subtitle':
      this.overridingTranslations[
        'ach-positive-pay.view-rules.empty-state.subtitle'
      ] ||
      $localize`:ACH rules list empty state subtitle - 'You don't have any ACH rules to be
      displayed.'|This string is used as the subtitle for the empty state of the
      ACH rules list. It is presented to the user when there are no ACH rules to
      display. This subtitle is located in the ACH rules list
      view.@@ach-positive-pay.view-rules.empty-state.subtitle:You don't have any ACH rules to be displayed.`,
  };
}
