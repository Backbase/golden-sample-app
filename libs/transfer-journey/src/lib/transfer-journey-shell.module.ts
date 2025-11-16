import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import {
  MakeTransferFormComponent,
  MakeTransferSummaryComponent,
} from '@backbase/transfer-journey/internal/ui';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';
import { TransferJourneyComponent } from './transfer-journey.component';
import { MakeTransferJourneyConfiguration } from '@backbase/transfer-journey/internal/data-access';
import {
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase/transfer-journey/internal/data-access';
import { TRANSLATIONS } from '@backbase/transfer-journey/internal/shared-data';
import { TrackerModule } from '@backbase/foundation-ang/observability';
import { AlertModule } from '@backbase/ui-ang/alert';

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
      loadComponent: () =>
        import('@backbase/transfer-journey/internal/feature').then(
          (m) => m.MakeTransferViewComponent
        ),
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      },
      resolve: {
        title: MakeTransferRouteTitleResolverService,
      },
    },
    {
      path: 'make-transfer-summary',
      loadComponent: () =>
        import('@backbase/transfer-journey/internal/feature').then(
          (m) => m.MakeTransferSummaryViewComponent
        ),
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
      loadComponent: () =>
        import('@backbase/transfer-journey/internal/feature').then(
          (m) => m.MakeTransferSuccessViewComponent
        ),
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
