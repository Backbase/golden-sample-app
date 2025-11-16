import { Provider } from '@angular/core';
import { provideRoutes, Route } from '@angular/router';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';
import { MakeTransferJourneyConfiguration } from '@backbase/transfer-journey/internal/data-access';
import {
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase/transfer-journey/internal/data-access';
import { TRANSLATIONS } from '@backbase/transfer-journey/internal/shared-data';

export const defaultTransferRoute: Route = {
  path: '',
  loadComponent: () =>
    import('./transfer-journey.component').then(
      (m) => m.TransferJourneyComponent
    ),
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

/**
 * Provides the default configuration for Transfer Journey.
 * For standalone applications, use provideTransferJourney() in app config.
 */
export function provideTransferJourney(
  data: { [key: string]: unknown; route: Route } = {
    route: defaultTransferRoute,
  }
): Provider[] {
  return [
    provideRoutes([data.route]),
    MakeTransferJourneyStoreGuard,
    MakeTransferJourneyConfiguration,
    MakeTransferPermissionsService,
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
  ];
}
