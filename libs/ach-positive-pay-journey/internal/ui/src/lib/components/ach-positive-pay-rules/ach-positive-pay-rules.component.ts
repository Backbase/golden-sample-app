import { Component, Input } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';
import {
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
  private _translations: AchPositivePayRulesTranslations = {
    ...achPositivePayRulesTranslations,
  };

  @Input()
  set translations(value: Partial<AchPositivePayRulesTranslations>) {
    this._translations = { ...achPositivePayRulesTranslations, ...value };
  }

  get translations(): AchPositivePayRulesTranslations {
    return this._translations;
  }
}
