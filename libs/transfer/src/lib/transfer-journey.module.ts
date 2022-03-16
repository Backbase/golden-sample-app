import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { MakeTransferJourneyState } from './services/make-transfer-journey-state.service';
import { MakeTransferFormComponent } from './components/make-transfer-form/make-transfer-form.component';
import { MakeTransferSummaryComponent } from './components/make-transfer-summary/make-transfer-summary.component';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';
import { TransferJourneyComponent } from './transfer-journey.component';
import { MakeTransferSuccessViewComponent } from './views/make-transfer-success-view/make-transfer-success-view.component';
import { MakeTransferSummaryViewComponent } from './views/make-transfer-summary-view/make-transfer-summary-view.component';
import { MakeTransferViewComponent } from './views/make-transfer-view/make-transfer-view.component';
import { MakeTransferJourneyConfiguration } from './services/make-transfer-journey-config.service';
import { MakeTransferPermissionsService } from './services/make-transfer-permissions.service';
import { MakeTransferAccountHttpService } from './services/make-transfer-accounts.http.service';
import { ButtonModule } from '@backbase/ui-ang/button';
import { CurrencyInputModule } from '@backbase/ui-ang/currency-input';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { InputValidationMessageModule } from '@backbase/ui-ang/input-validation-message';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { MakeTransferRouteTitleResolverService } from './services/make-transfer-route-title-resolver.service';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { MakeTransferTitleComponent } from './components/make-transfer-ui/make-transfer-title.component';

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
    MakeTransferViewComponent,
    MakeTransferFormComponent,
    MakeTransferSummaryComponent,
    MakeTransferSummaryViewComponent,
    MakeTransferSuccessViewComponent,
    MakeTransferTitleComponent,
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
  ],
  providers: [
    MakeTransferJourneyStoreGuard,
    MakeTransferJourneyState,
    MakeTransferJourneyConfiguration,
    MakeTransferPermissionsService,
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
  ],
  exports: [TransferJourneyComponent],
})
export class TransferJourneyModule {
  static forRoot(
    data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransferJourneyModule> {
    return {
      ngModule: TransferJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
