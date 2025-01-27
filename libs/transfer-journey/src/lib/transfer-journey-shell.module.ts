import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import {
  MakeTransferFormComponent,
  MakeTransferSummaryComponent,
} from '@backbase-gsa/transfer-journey/internal/ui';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';
import { TransferJourneyComponent } from './transfer-journey.component';
import {
  MakeTransferSuccessViewComponent,
  MakeTransferSummaryViewComponent,
  MakeTransferViewComponent,
} from '@backbase-gsa/transfer-journey/internal/feature';
import { MakeTransferJourneyConfiguration } from '@backbase-gsa/transfer-journey/internal/data-access';
import {
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase-gsa/transfer-journey/internal/data-access';
import { TRANSLATIONS } from '@backbase-gsa/transfer-journey/internal/shared-data';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { AlertModule } from '@backbase/ui-ang/alert';
import { TRANSFER_JOURNEY_TRANSLATIONS } from './translations.provider';
import { TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS } from 'libs/transfer-journey/internal/ui/src/lib/components/make-transfer-form/translations.provider';

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
  declarations: [TransferJourneyComponent],
  imports: [
    CommonModule,
    RouterModule,
    AlertModule,
    TrackerModule.forJourney({
      journeyName: 'transfer',
    }),
    MakeTransferFormComponent,
    MakeTransferSummaryComponent,
    MakeTransferSummaryViewComponent,
    MakeTransferSuccessViewComponent,
    MakeTransferViewComponent,
  ],
  providers: [
    MakeTransferJourneyStoreGuard,
    MakeTransferJourneyConfiguration,
    MakeTransferPermissionsService,
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
    {
      provide: TRANSFER_JOURNEY_TRANSLATIONS,
      useValue: {},
    },
    {
      provide: TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS,
      useValue: {
        'transfer.form.toAccount.error.required': $localize`:To account required error message - 'Required field'|This string
              is used as the error message for the 'To Account' field in the
              transfer form when the field is required but not filled. It is
              presented to the user when they need to fill in the 'To Account'
              field. This error message is located in the transfer form
              layout.@@transfer.form.toAccount.error.required:Required field`,
      },
    },
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
