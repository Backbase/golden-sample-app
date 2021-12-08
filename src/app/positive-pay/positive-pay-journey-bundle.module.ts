import { NgModule } from '@angular/core';
import {
  POSITIVE_PAY_JOURNEY_CONFIGURATION_TOKEN,
  PositivePayJourneyConfiguration,
  PositivePayJourneyModule,
} from '@backbase/positive-pay-journey-ang';
import { CONDITIONS } from '@backbase/foundation-ang/web-sdk';
import { buildEntitlementsByUser, triplets } from '../services/entitlementsTriplets';

@NgModule({
  imports: [PositivePayJourneyModule.forRoot()],
  providers: [
    {
      provide: POSITIVE_PAY_JOURNEY_CONFIGURATION_TOKEN,
      useValue: {
        pageSize: 10,
      } as PositivePayJourneyConfiguration,
    },
    {
      provide: CONDITIONS,
      useFactory: () => ({
        resolveEntitlements: (triplet: string) =>
          buildEntitlementsByUser({
            [triplets.canViewPositivePay]: true,
            [triplets.canEditPositivePay]: true,
          })(triplet),
      }),
    },
  ],
})
export class PositivePayJourneyBundleModule {}
