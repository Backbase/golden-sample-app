import { AuthGuard } from '@backbase-gsa/shared/feature/auth';
import { UserContextGuard } from '@backbase-gsa/shared/feature/user-context';

export const USER_ACCOUNTS_ROUTE = {
  path: 'accounts',
  loadChildren: () =>
    import('./user-accounts.module').then((m) => m.UserAccountsModule),
  canActivate: [AuthGuard, UserContextGuard],
};
