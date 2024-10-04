import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard, triplets, UserContextGuard } from '@backbase-gsa/shared';

export const TRANSACTIONS_JOURNEY_BUNDLE = {
  path: 'transactions',
  loadChildren: () =>
    import('./transactions-journey-bundle.module').then(
      (m) => m.TransactionsJourneyBundleModule
    ),
  data: {
    entitlements: triplets.canViewTransactions,
  },
  canActivate: [AuthGuard, UserContextGuard, EntitlementsGuard],
};
