import { NgModule } from '@angular/core';
import { HeroesJourneyComponent } from './heroes-journey.component';
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [ HeroesJourneyComponent ],
  imports: [
    RouterModule.forChild([
      { path: '', component: HeroesJourneyComponent }
    ])
  ],
  exports: [ HeroesJourneyComponent ]
})
export class HeroesJourneyModule {
}
