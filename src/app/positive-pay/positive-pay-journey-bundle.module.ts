import { NgModule } from '@angular/core';
import {
  POSITIVE_PAY_JOURNEY_CONFIGURATION_TOKEN,
  PositivePayJourneyConfiguration,
  PositivePayJourneyModule
} from '@backbase/positive-pay-journey-ang';

@NgModule({
  imports: [
    PositivePayJourneyModule.forRoot(),
  ],
  providers: [ {
    provide: POSITIVE_PAY_JOURNEY_CONFIGURATION_TOKEN,
    useValue: {
      pageSize: 10,
    } as PositivePayJourneyConfiguration
  } ],
})
export class PositivePayJourneyBundleModule {
}
