import { NgModule } from '@angular/core';
import { AchPositivePayJourneyModule } from '@golden-sample-app/ach-positive-pay-journey';

@NgModule({
  imports: [AchPositivePayJourneyModule.forRoot()],
})
export class AchPositivePayJourneyBundleModule {}
