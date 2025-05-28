import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { ViewWrapperComponent } from '@backbase/shared/feature/view-wrapper';

export const CUSTOM_PAYMENT_ROUTE = {
  path: 'transfer-internal',
  component: ViewWrapperComponent,
  loadChildren: () =>
    import('./initiate-payment-journey-bundle.module').then(
      (m) => m.CustomPaymentJourneyBundleModule
    ),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
