import { Component, Inject } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';
import {
  ACH_POSITIVE_PAY_RULES_TRANSLATIONS,
  AchPositivePayRulesTranslations,
  achPositivePayRulesTranslations,
} from '../../../translations-catalog';

@Component({
  selector: 'bb-ach-positive-pay-rules',
  templateUrl: './ach-positive-pay-rules.component.html',
  imports: [EmptyStateModule],
  standalone: true,
})
export class AchPositivePayRulesComponent {
  private readonly defaultTranslations: AchPositivePayRulesTranslations =
    achPositivePayRulesTranslations;
  public readonly translations: AchPositivePayRulesTranslations;
  constructor(
    @Inject(ACH_POSITIVE_PAY_RULES_TRANSLATIONS)
    private readonly overridingTranslations: Partial<AchPositivePayRulesTranslations>
  ) {
    
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations ?? {}).map(([key, value]) => [
          key,
          value ?? this.defaultTranslations[key],
        ])
      ),
    };
  }
}
