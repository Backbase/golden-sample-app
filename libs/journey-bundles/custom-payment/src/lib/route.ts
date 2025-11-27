import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { ViewWrapperComponent } from '@backbase/shared/feature/view-wrapper';

/**
 * Note: This route still uses loadChildren with the module approach because
 * @backbase/initiate-payment-journey-ang doesn't yet provide a standalone API.
 * Once a standalone API is available, this can be updated to use loadComponent.
 */
export const CUSTOM_PAYMENT_ROUTE = {
  path: 'transfer-internal',
  component: ViewWrapperComponent,
  loadChildren: () =>
    import('./initiate-payment-journey-bundle.module').then(
      (m) => m.CustomPaymentJourneyBundleModule
    ),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
