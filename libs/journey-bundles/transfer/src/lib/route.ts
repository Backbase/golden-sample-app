import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { Route } from '@angular/router';

export const TRANSFER_ROUTE: Route = {
  path: 'transfer',
  loadChildren: () => import('./transfer-journey.bundle'),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
