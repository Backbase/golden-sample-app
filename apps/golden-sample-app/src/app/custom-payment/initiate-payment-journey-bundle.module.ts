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
  ],
})
export class CustomPaymentJourneyBundleModule {}
