import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  INITIATE_PAYMENT_CONFIG,
  InitiatePaymentJourneyModule,
} from '@backbase/initiate-payment-journey-ang';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { InitiatorComponent } from './components/initiator/initiator.component';
import { customPaymentConfig } from './custom-payment.config';

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
  ],
})
export class CustomPaymentJourneyBundleModule {}
