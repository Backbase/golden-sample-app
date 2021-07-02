import { NgModule } from '@angular/core';
import { PositivePayJourneyComponent } from './positive-pay-journey.component';
import { PositivePayChecksContainerComponent } from './views/positive-pay-checks-container/positive-pay-checks-container.component';
import { PositivePayViewChecksComponent } from './views/positive-pay-view-checks/positive-pay-view-checks.component';
import { defaultPositivePayRoute } from './positive-pay-journey-routing';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { ButtonModule, HeaderModule, IconModule } from '@backbase/ui-ang';
import { TabContainerModule } from '@backbase/universal-ang';
import { CommonModule } from '@angular/common';
import { PositivePayStoreModule } from './state/positive-pay-store.module';

const publicComponents = [
  PositivePayJourneyComponent,
  PositivePayChecksContainerComponent,
  PositivePayViewChecksComponent,
];

// const privateComponents = [];

const uiModules = [HeaderModule, ButtonModule, IconModule, TabContainerModule];

@NgModule({
  declarations: [...publicComponents],
  imports: [CommonModule, RouterModule, ...uiModules, PositivePayStoreModule],
  exports: [...publicComponents],
})
export class PositivePayJourneyModule {
  static forRoot(data: { [key: string]: any; route: Route } = { route: defaultPositivePayRoute }) {
    return {
      ngModule: PositivePayJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
