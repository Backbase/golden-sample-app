import { ModuleWithProviders, NgModule } from '@angular/core';
import { AchPositivePayJourneyComponent } from './views/ach-positive-pay-journey/ach-positive-pay-journey.component';
import { AchPositivePayRulesComponent } from './views/ach-positive-pay-rules/ach-positive-pay-rules.component';
import { AchPositivePayNewRuleComponent } from './views/ach-positive-pay-new-rule/ach-positive-pay-new-rule.component';
import { HeadingWidgetModule } from '@backbase/universal-ang';
import {
  AccountSelectorModule,
  AlertModule,
  ButtonModule,
  DropdownSingleSelectModule,
  EmptyStateModule,
  HeaderModule,
  InputTextModule,
  InputValidationMessageModule,
  LoadButtonModule,
  ModalModule,
} from '@backbase/ui-ang';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { AchPositivePayRuleFormComponent } from './views/ach-positive-pay-new-rule/ach-positive-pay-rule-form/ach-positive-pay-rule-form.component';
import { AchPositivePayHttpService } from './services/ach-positive-pay.http.service';

@NgModule({
  declarations: [
    AchPositivePayJourneyComponent,
    AchPositivePayRulesComponent,
    AchPositivePayNewRuleComponent,
    AchPositivePayRuleFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeadingWidgetModule,
    EmptyStateModule,
    ModalModule,
    HeaderModule,
    ButtonModule,
    LoadButtonModule,
    InputValidationMessageModule,
    AccountSelectorModule,
    DropdownSingleSelectModule,
    InputTextModule,
    AlertModule,
    EntitlementsModule,
  ],
  exports: [
    AchPositivePayJourneyComponent,
    AchPositivePayRulesComponent,
    AchPositivePayNewRuleComponent,
  ],
  providers: [AchPositivePayHttpService],
})
export class AchPositivePayJourneyModule {
  static forRoot(
    data: { [key: string]: unknown; routes: Routes } = {
      routes: achPositivePayDefaultRoutes,
    }
  ): ModuleWithProviders<AchPositivePayJourneyModule> {
    return {
      ngModule: AchPositivePayJourneyModule,
      providers: [provideRoutes(data.routes)],
    };
  }
}
