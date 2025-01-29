import { Component, Input } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';

export interface Translations {
  [key: string]: string;
}

@Component({
  selector: 'bb-ach-positive-pay-rules',
  templateUrl: './ach-positive-pay-rules.component.html',
  imports: [EmptyStateModule],
  standalone: true,
})
export class AchPositivePayRulesComponent {
  @Input()
  public readonly translations: Translations = {};
  public readonly defaultTranslations: Translations = {
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

  constructor() {
    this.translations = {
      ...this.defaultTranslations,
      ...this.translations,
    };
  }
}
