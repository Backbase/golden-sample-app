import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  INITIATE_PAYMENT_CONFIG,
  InitiatePaymentJourneyModule,
  ӨReviewPaymentService
} from '@backbase/initiate-payment-journey-ang';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { Router } from '@angular/router';
import { InitiatorComponent } from './components/initiator/initiator.component';
import { customPaymentConfig, setRouter } from './custom-payment.config';

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
    isInModal: () => false
  };
}

@NgModule({
  /**
   * Declare the custom component here for journey to be able to add it to the form dynamically
   */
  declarations: [InitiatorComponent],
  imports: [
    AccountSelectorModule,
    CommonModule,
    InitiatePaymentJourneyModule.forRoot(),
  ],
  providers: [
    {
      provide: INITIATE_PAYMENT_CONFIG,
      useValue: customPaymentConfig,
    },
    {
      provide: ӨReviewPaymentService,
      useFactory: reviewServiceFactory,
      deps: [Router]
    }
  ],
})
export class CustomPaymentJourneyBundleModule {
  constructor(router: Router) {
    // Inject router into the config for hooks
    setRouter(router);
  }
}
