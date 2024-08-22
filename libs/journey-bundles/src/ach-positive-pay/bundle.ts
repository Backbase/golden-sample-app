import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard, triplets, UserContextGuard } from '@backbase-gsa/shared';

export const ACH_POSITIVE_PAY_JOURNEY_BUNDLE = {
  path: 'ach-positive-pay',
  loadChildren: () =>
    import('./ach-positive-pay-journey-bundle.module').then(
      (m) => m.AchPositivePayJourneyBundleModule
    ),
  canActivate: [AuthGuard, UserContextGuard, EntitlementsGuard],
  data: {
    entitlements: triplets.canViewAchRule,
  },
};
