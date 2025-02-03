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
  @Input()
  public readonly translations: AchPositivePayRulesTranslations =
    achPositivePayRulesTranslations;
}
