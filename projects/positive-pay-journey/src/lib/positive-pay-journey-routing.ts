import { PositivePayJourneyComponent } from './positive-pay-journey.component';
import { Route } from '@angular/router';
import { PositivePayChecksContainerComponent } from './views/positive-pay-checks-container/positive-pay-checks-container.component';
import { PositivePayViewChecksComponent } from './views/positive-pay-view-checks/positive-pay-view-checks.component';

declare const $localize: any;

const routeTitles = {
  allChecks: () => $localize`:Title for tab with "All checks" list@@positive-pay.tabs.all-checks:All checks`,
  exceptions: () => $localize`:Title for tab with "Exceptions" list@@positive-pay.tabs.exceptions:Exceptions`,
};

export const defaultPositivePayRoute: Route = {
  path: '',
  component: PositivePayJourneyComponent,
  children: [
    {
      path: 'checks',
      component: PositivePayChecksContainerComponent,
      children: [
        {
          path: 'view',
          component: PositivePayViewChecksComponent,
          data: {
            title: routeTitles.allChecks(),
          },
        },
        {
          path: 'exceptions',
          component: PositivePayViewChecksComponent,
          data: {
            title: routeTitles.exceptions(),
          },
        },
        { path: '', redirectTo: 'view', pathMatch: 'full' },
      ],
    },
    { path: '', redirectTo: 'checks', pathMatch: 'full' },
  ],
};
