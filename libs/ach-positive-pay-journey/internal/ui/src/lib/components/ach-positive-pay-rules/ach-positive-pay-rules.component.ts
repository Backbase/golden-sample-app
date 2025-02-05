import { Component, Inject } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';
import {
  ACH_POSITIVE_PAY_RULES_TRANSLATIONS,
  AchPositivePayRulesTranslations,
  achPositivePayRulesTranslations as defaultTranslations,
} from '../../../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'bb-ach-positive-pay-rules',
  templateUrl: './ach-positive-pay-rules.component.html',
  imports: [EmptyStateModule],
  standalone: true,
})
export class AchPositivePayRulesComponent extends TranslationsBase<AchPositivePayRulesTranslations> {
  constructor(
    @Inject(ACH_POSITIVE_PAY_RULES_TRANSLATIONS)
    private readonly _translations: Partial<AchPositivePayRulesTranslations>
  ) {
    super(defaultTranslations, _translations);
  }
}
