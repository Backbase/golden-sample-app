import { NgModule } from '@angular/core';
import { AchPositivePayJourneyModule } from '@libs/ach-positive-pay';

@NgModule({
  imports: [AchPositivePayJourneyModule.forRoot()],
})
export class AchPositivePayJourneyBundleModule {}
