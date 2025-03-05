import { AuthGuard } from '@backbase-gsa/shared/feature/auth';
import { UserContextGuard } from '@backbase-gsa/shared/feature/user-context';
import { ViewWrapperComponent } from '@backbase-gsa/shared/feature/view-wrapper';

export const CUSTOM_PAYMENT_ROUTE = {
  path: 'transfer-internal',
  component: ViewWrapperComponent,
  loadChildren: () =>
    import('./initiate-payment-journey-bundle.module').then(
      (m) => m.CustomPaymentJourneyBundleModule
    ),
  canActivate: [AuthGuard, UserContextGuard],
};
