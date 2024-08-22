import { AuthGuard, UserContextGuard, ViewWrapperComponent } from '@backbase-gsa/shared';

export const CUSTOM_PAYMENT_JOURNEY_BUNDLE = {
  path: 'transfer-internal',
  component: ViewWrapperComponent,
  loadChildren: () =>
    import('./initiate-payment-journey-bundle.module').then(
      (m) => m.CustomPaymentJourneyBundleModule
    ),
  canActivate: [AuthGuard, UserContextGuard],
}
