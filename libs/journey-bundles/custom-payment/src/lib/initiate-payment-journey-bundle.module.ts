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
import { createCustomPaymentConfig } from './custom-payment.config';
import { PaymentsCommunicationService } from '@backbase/shared/feature/communication';
import { reviewServiceFactory } from './provide-custom-payment-journey';

/**
 * Custom Payment Journey Bundle Module
 *
 * This module wraps @backbase/initiate-payment-journey-ang with custom configuration.
 *
 * Note: This module approach is required because @backbase/initiate-payment-journey-ang
 * does not yet provide a standalone API. Once a standalone API is available from
 * the library, this module can be migrated to use `provideCustomPaymentJourney()`
 * with a route bundle file approach.
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
      useFactory: createCustomPaymentConfig,
      deps: [Router],
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
export class CustomPaymentJourneyBundleModule {}
