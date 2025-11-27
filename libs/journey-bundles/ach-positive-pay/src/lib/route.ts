import { withEntitlements } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { PERMISSIONS } from '@backbase/shared/util/permissions';
import { Routes } from '@angular/router';

export const ACH_POSITIVE_PAY_ROUTE = {
  path: 'ach-positive-pay',
  loadChildren: async (): Promise<Routes> => {
    const journeyModule = await import('@backbase/ach-positive-pay-journey');

    // Add providers to the first route in the array
    const routes = [...journeyModule.achPositivePayDefaultRoutes];
    if (routes.length > 0 && routes[0]) {
      routes[0] = {
        ...routes[0],
        providers: [
          ...(routes[0].providers || []),
          journeyModule.provideAchPositivePayJourney(),
        ],
      };
    }

    return routes;
  },
  canActivate: [
    AuthGuard,
    SharedUserContextGuard,
    withEntitlements(PERMISSIONS.canViewAchRule, '/'),
  ],
};
