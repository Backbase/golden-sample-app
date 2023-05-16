import { ModuleWithProviders, NgModule } from '@angular/core';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { Routes, provideRoutes } from '@angular/router';

@NgModule({

  imports: [
    EntitlementsModule,
  ]
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