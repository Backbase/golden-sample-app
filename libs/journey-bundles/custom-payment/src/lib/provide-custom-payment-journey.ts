import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Router } from '@angular/router';
import {
  INITIATE_PAYMENT_CONFIG,
  ӨReviewPaymentService,
  INITIATE_PAYMENT_JOURNEY_COMMUNICATOR,
} from '@backbase/initiate-payment-journey-ang';
import { PaymentsCommunicationService } from '@backbase/shared/feature/communication';
import { customPaymentConfig, setRouter } from './custom-payment.config';

/**
 * Factory function for the review service
 */
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
 * Provides the Custom Payment Journey configuration in a standalone context.
 *
 * Note: This provider assumes that the InitiatePaymentJourneyModule providers
 * are already available. You may need to import InitiatePaymentJourneyModule.forRoot()
 * or wait for a standalone API from @backbase/initiate-payment-journey-ang.
 *
 * @returns Environment providers for Custom Payment Journey
 *
 * @example
 * ```typescript
 * import { ApplicationConfig } from '@angular/core';
 * import { provideCustomPaymentJourney } from '@backbase/journey-bundles/custom-payment';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideCustomPaymentJourney(),
 *   ],
 * };
 * ```
 */
export function provideCustomPaymentJourney(): EnvironmentProviders {
  return makeEnvironmentProviders([
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
    },
  ]);
}

/**
 * Initializes the router reference for the custom payment config.
 * This should be called in the app initializer or constructor.
 */
export function initializeCustomPaymentRouter(router: Router): void {
  setRouter(router);
}
