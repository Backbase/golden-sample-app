import { NgModule } from '@angular/core';
import { AchPositivePayJourneyModule } from 'ach-positive-pay-journey';

@NgModule({
  imports: [AchPositivePayJourneyModule.forRoot()],
})
export class AchPositivePayJourneyBundleModule {}
