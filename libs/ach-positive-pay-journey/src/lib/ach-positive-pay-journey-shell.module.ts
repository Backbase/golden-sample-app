import { ModuleWithProviders, NgModule } from '@angular/core';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { Routes, provideRoutes, RouterModule } from '@angular/router';
import {
  AchPositivePayJourneyComponent,
  AchPositivePayNewRuleComponent,
} from '@backbase-gsa/ach-positive-pay-journey/internal/feature';
import { AchPositivePayRulesComponent } from '@backbase-gsa/ach-positive-pay-journey/internal/ui';
import { PageHeaderModule } from '@backbase/ui-ang/page-header';
import { ModalModule } from '@backbase/ui-ang/modal';
import { AlertModule } from '@backbase/ui-ang/alert';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { ButtonModule } from '@backbase/ui-ang/button';

@NgModule({
  imports: [
    EntitlementsModule,
    RouterModule,
    PageHeaderModule,
    ModalModule,
    AlertModule,
    LoadButtonModule,
    ButtonModule,
    AchPositivePayJourneyComponent,
    AchPositivePayNewRuleComponent,
    AchPositivePayRulesComponent,
  ],
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
