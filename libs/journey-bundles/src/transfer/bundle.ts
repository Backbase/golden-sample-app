import { AuthGuard, UserContextGuard } from '@backbase-gsa/shared';

export const TRANSFER_JOURNEY_BUNDLE = {
  path: 'transfer',
  loadChildren: () =>
    import('./transfer-journey-bundle.module').then(
      (m) => m.TransferJourneyBundleModule
    ),
  canActivate: [AuthGuard, UserContextGuard],
}
