import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';

export const USER_ACCOUNTS_ROUTE = {
  path: 'accounts',
  loadChildren: () =>
    import('./user-accounts.module').then((m) => m.UserAccountsModule),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
