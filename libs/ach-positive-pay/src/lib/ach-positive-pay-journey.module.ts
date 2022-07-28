import { ModuleWithProviders, NgModule } from '@angular/core';
import { AchPositivePayJourneyComponent } from './views/ach-positive-pay-journey/ach-positive-pay-journey.component';
import { AchPositivePayRulesComponent } from './views/ach-positive-pay-rules/ach-positive-pay-rules.component';
import { AchPositivePayNewRuleComponent } from './views/ach-positive-pay-new-rule/ach-positive-pay-new-rule.component';
import { HeadingWidgetModule } from '@backbase/universal-ang';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { AlertModule } from '@backbase/ui-ang/alert';
import { ButtonModule } from '@backbase/ui-ang/button';
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';
import { HeaderModule } from '@backbase/ui-ang/header';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import { InputValidationMessageModule } from '@backbase/ui-ang/input-validation-message';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { ModalModule } from '@backbase/ui-ang/modal';
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
