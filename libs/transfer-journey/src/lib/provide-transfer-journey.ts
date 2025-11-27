import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideRoutes, Route } from '@angular/router';
import { provideJourneyTracker } from '@backbase/foundation-ang/observability';
import {
  MakeTransferJourneyConfiguration,
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase/transfer-journey/internal/data-access';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';

/**
 * Provides the Transfer Journey configuration in a standalone context.
 *
 * @param route - Optional custom route configuration. If not provided, uses default route.
 * @returns Environment providers for Transfer Journey
 *
 * @example
 * ```typescript
 * import { ApplicationConfig } from '@angular/core';
 * import { provideTransferJourney } from '@backbase/transfer-journey';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTransferJourney(),
 *   ],
 * };
 * ```
 */
export function provideTransferJourney(route?: Route): EnvironmentProviders {
  const defaultRoute: Route = {
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
          title: 'Make Transfer',
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
          title: 'Make Transfer',
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
          title: 'Make Transfer',
        },
        resolve: {
          title: MakeTransferRouteTitleResolverService,
        },
        canActivate: [MakeTransferJourneyStoreGuard],
      },
    ],
  };

  return makeEnvironmentProviders([
    provideRoutes([route || defaultRoute]),
    provideJourneyTracker({
      journeyName: 'transfer',
    }),
    MakeTransferJourneyStoreGuard,
    MakeTransferJourneyConfiguration,
    MakeTransferPermissionsService,
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
  ]);
}
