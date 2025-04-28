import { AuthGuard } from '@backbase-gsa/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase-gsa/shared/feature/user-context';

export const TRANSFER_ROUTE = {
  path: 'transfer',
  loadChildren: () =>
    import('./transfer-journey-bundle.module').then(
      (m) => m.TransferJourneyBundleModule
    ),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
