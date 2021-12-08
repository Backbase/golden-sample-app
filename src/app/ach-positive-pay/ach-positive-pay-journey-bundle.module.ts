import { NgModule } from '@angular/core';
import { AchPositivePayJourneyModule } from 'ach-positive-pay-journey';
import { CONDITIONS } from '@backbase/foundation-ang/web-sdk';
import { buildEntitlementsByUser, triplets } from '../services/entitlementsTriplets';

@NgModule({
  imports: [AchPositivePayJourneyModule.forRoot()],
  providers: [
    {
      provide: CONDITIONS,
      useFactory: () => ({
        resolveEntitlements: (triplet: string) =>
          buildEntitlementsByUser({
            [triplets.canViewAchRule]: true,
            [triplets.canCreateAchRule]: true,
          })(triplet),
      }),
    },
  ],
})
export class AchPositivePayJourneyBundleModule {}
