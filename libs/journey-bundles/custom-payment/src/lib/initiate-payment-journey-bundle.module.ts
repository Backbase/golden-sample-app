import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  INITIATE_PAYMENT_CONFIG,
  InitiatePaymentJourneyModule,
  ӨReviewPaymentService,
  INITIATE_PAYMENT_JOURNEY_COMMUNICATOR,
} from '@backbase/initiate-payment-journey-ang';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { Router } from '@angular/router';
import { InitiatorComponent } from './components/initiator/initiator.component';
import { customPaymentConfig, setRouter } from './custom-payment.config';
import { PaymentsCommunicationService } from '@backbase/shared/feature/communication';

// Create a provider for the review service
export function reviewServiceFactory(router: Router) {
  return {
    navigateFromSuccess: () => {
      router.navigate(['/transactions']);
    },
    navigateFromCancel: () => {
      router.navigate(['/transactions']);
    },
    navigateFromError: () => {
      router.navigate(['/error']);
    },
    isInModal: () => false,
  };
}

/**
 * @deprecated This module is deprecated. Use `provideCustomPaymentJourney()` instead.
 *
 * Migration example:
 * ```typescript
 * // Before (NgModule)
 * import { CustomPaymentJourneyBundleModule } from '@backbase/journey-bundles/custom-payment';
 *
 * @NgModule({
 *   imports: [CustomPaymentJourneyBundleModule]
 * })
 *
 * // After (Standalone)
 * import { provideCustomPaymentJourney } from '@backbase/journey-bundles/custom-payment';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCustomPaymentJourney(),
 *   ],
 * };
 * ```
 */
@NgModule({
  /**
   * Import the standalone component here for journey to be able to add it to the form dynamically
   */
  imports: [
    AccountSelectorModule,
    CommonModule,
    InitiatePaymentJourneyModule.forRoot(),
    InitiatorComponent,
  ],
  providers: [
    {
      provide: INITIATE_PAYMENT_CONFIG,
      useValue: customPaymentConfig,
    },
    {
      provide: ӨReviewPaymentService,
      useFactory: reviewServiceFactory,
      deps: [Router],
    },
    {
      provide: INITIATE_PAYMENT_JOURNEY_COMMUNICATOR,
      useExisting: PaymentsCommunicationService,
      deps: [Router],
    },
  ],
})
export class CustomPaymentJourneyBundleModule {
  constructor(router: Router) {
    // Inject router into the config for hooks
    setRouter(router);
  }
}
