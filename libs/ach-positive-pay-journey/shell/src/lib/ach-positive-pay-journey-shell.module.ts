import { ModuleWithProviders, NgModule } from '@angular/core';
import { AchPositivePayJourneyComponent } from './views/ach-positive-pay-journey/ach-positive-pay-journey.component';
import { AchPositivePayRulesComponent } from '@backbase-gsa/internal-ach-positive-pay-ui';
import { AchPositivePayNewRuleComponent } from './views/ach-positive-pay-new-rule/ach-positive-pay-new-rule.component';
import { HeadingModule } from '@backbase/ui-ang/heading';
import { AlertModule } from '@backbase/ui-ang/alert';
import { ButtonModule } from '@backbase/ui-ang/button';
import { HeaderModule } from '@backbase/ui-ang/header';
import { InputValidationMessageModule } from '@backbase/ui-ang/input-validation-message';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { ModalModule } from '@backbase/ui-ang/modal';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { AchPositivePayRuleFormComponent } from '@backbase-gsa/internal-ach-positive-pay-ui';
import { AchPositivePayHttpService } from '@backbase-gsa/internal-ach-positive-pay-data-access';

@NgModule({
  declarations: [
    AchPositivePayJourneyComponent,
    AchPositivePayNewRuleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeadingModule,
    ModalModule,
    HeaderModule,
    ButtonModule,
    LoadButtonModule,
    InputValidationMessageModule,
    AlertModule,
    EntitlementsModule,
    AchPositivePayRuleFormComponent,
    AchPositivePayRulesComponent,
  ],
  exports: [
    AchPositivePayJourneyComponent,
    AchPositivePayRulesComponent,
    AchPositivePayNewRuleComponent,
  ],
  providers: [AchPositivePayHttpService],
})
export class AchPositivePayJourneyShellModule {
  static forRoot(
    data: { [key: string]: unknown; routes: Routes } = {
      routes: achPositivePayDefaultRoutes,
    }
  ): ModuleWithProviders<AchPositivePayJourneyShellModule> {
    return {
      ngModule: AchPositivePayJourneyShellModule,
      providers: [provideRoutes(data.routes)],
    };
  }
}