import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { MakeTransferFormComponent } from '@backbase-gsa/internal-transfer-ui';
import { MakeTransferSummaryComponent } from '@backbase-gsa/internal-transfer-ui';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';
import { TransferJourneyComponent } from './transfer-journey.component';
import { MakeTransferSuccessViewComponent } from './views/make-transfer-success-view/make-transfer-success-view.component';
import { MakeTransferSummaryViewComponent } from './views/make-transfer-summary-view/make-transfer-summary-view.component';
import { MakeTransferViewComponent } from './views/make-transfer-view/make-transfer-view.component';
import { MakeTransferJourneyConfiguration } from '@backbase-gsa/internal-transfer-data-access';
import { MakeTransferPermissionsService } from '@backbase-gsa/internal-transfer-data-access';
import { MakeTransferAccountHttpService } from '@backbase-gsa/internal-transfer-data-access';
import { ButtonModule } from '@backbase/ui-ang/button';
import { CurrencyInputModule } from '@backbase/ui-ang/currency-input';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { AlertModule } from '@backbase/ui-ang/alert';
import { InputValidationMessageModule } from '@backbase/ui-ang/input-validation-message';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { MakeTransferRouteTitleResolverService } from '@backbase-gsa/internal-transfer-data-access';
import { TRANSLATIONS } from '@backbase-gsa/internal-transfer-util';
import { TrackerModule } from '@backbase/foundation-ang/observability';

const defaultRoute: Route = {
  path: '',
  component: TransferJourneyComponent,
  children: [
    {
      path: '',
      redirectTo: 'make-transfer',
      pathMatch: 'full',
    },
    {
      path: 'make-transfer',
      component: MakeTransferViewComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      },
      resolve: {
        title: MakeTransferRouteTitleResolverService,
      },
    },
    {
      path: 'make-transfer-summary',
      component: MakeTransferSummaryViewComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      },
      resolve: {
        title: MakeTransferRouteTitleResolverService,
      },
      canActivate: [MakeTransferJourneyStoreGuard],
    },
    {
      path: 'make-transfer-success',
      component: MakeTransferSuccessViewComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      },
      resolve: {
        title: MakeTransferRouteTitleResolverService,
      },
      canActivate: [MakeTransferJourneyStoreGuard],
    },
  ],
};

@NgModule({
  declarations: [
    TransferJourneyComponent,
    MakeTransferSummaryViewComponent,
    MakeTransferSuccessViewComponent,
    MakeTransferViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CurrencyInputModule,
    AccountSelectorModule,
    InputValidationMessageModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
    AlertModule,
    TrackerModule.forJourney({
      journeyName: 'transfer',
    }),
    MakeTransferFormComponent,
    MakeTransferSummaryComponent,
  ],
  providers: [
    MakeTransferJourneyStoreGuard,
    MakeTransferJourneyConfiguration,
    MakeTransferPermissionsService,
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
  ],
  exports: [TransferJourneyComponent],
})
export class TransferJourneyShellModule {
  static forRoot(
    data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransferJourneyShellModule> {
    return {
      ngModule: TransferJourneyShellModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
