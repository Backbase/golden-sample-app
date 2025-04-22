import { ModuleWithProviders, NgModule } from '@angular/core';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { Routes, provideRoutes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '@backbase/ui-ang/page-header';
import { ModalModule } from '@backbase/ui-ang/modal';
import { AlertModule } from '@backbase/ui-ang/alert';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { ButtonModule } from '@backbase/ui-ang/button';

/**
 * ACH Positive Pay Journey Shell Module
 *
 * This module provides the main container for the ACH Positive Pay functionality.
 * The actual implementation of the TransactionSigningService should be provided
 * at the app level via the ACH_TRANSACTION_SIGNING_SERVICE token.
 */
@NgModule({
  imports: [
    CommonModule,
    EntitlementsModule,
    RouterModule,
    PageHeaderModule,
    ModalModule,
    AlertModule,
    LoadButtonModule,
    ButtonModule,
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
