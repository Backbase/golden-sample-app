import { Component } from '@angular/core';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';

@Component({
  selector: 'bb-ach-positive-pay-rules',
  templateUrl: './ach-positive-pay-rules.component.html',
  imports: [EmptyStateModule],
  standalone: true,
})
export class AchPositivePayRulesComponent {}
