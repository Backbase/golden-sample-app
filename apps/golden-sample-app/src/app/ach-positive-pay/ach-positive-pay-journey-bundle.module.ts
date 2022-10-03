import { NgModule } from '@angular/core';
import { AchPositivePayJourneyModule } from '@backbase-gsa/ach-positive-pay';

@NgModule({
  imports: [AchPositivePayJourneyModule.forRoot()],
})
export class AchPositivePayJourneyBundleModule {}
