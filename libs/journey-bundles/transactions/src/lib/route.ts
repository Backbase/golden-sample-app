import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { PERMISSIONS } from '@backbase/shared/util/permissions';

export const TRANSACTIONS_ROUTE = {
  path: 'transactions',
  loadChildren: () => import('./transactions.bundle'),
  data: {
    entitlements: PERMISSIONS.canViewTransactions,
  },
  canActivate: [AuthGuard, SharedUserContextGuard, EntitlementsGuard],
};
