import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { PERMISSIONS } from '@backbase/shared/util/permissions';
export const ACH_POSITIVE_PAY_ROUTE = {
  path: 'ach-positive-pay',
  loadChildren: () =>
    import('./ach-positive-pay-journey-bundle.module').then(
      (m) => m.AchPositivePayJourneyBundleModule
    ),
  canActivate: [AuthGuard, SharedUserContextGuard, EntitlementsGuard],
  data: {
    entitlements: PERMISSIONS.canViewAchRule,
  },
};
