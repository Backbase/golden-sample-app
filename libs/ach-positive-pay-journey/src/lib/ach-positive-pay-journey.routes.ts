import { Routes } from '@angular/router';
import {
  AchPositivePayJourneyComponent,
  AchPositivePayNewRuleComponent,
} from '@backbase-gsa/ach-positive-pay-journey/internal/feature';
import { AchPositivePayRulesComponent } from '@backbase-gsa/ach-positive-pay-journey/internal/ui';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { PERMISSIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';

export const achPositivePayDefaultRoutes: Routes = [
  {
    path: 'rules',
    component: AchPositivePayJourneyComponent,
    canActivate: [EntitlementsGuard],
    data: {
      entitlements: PERMISSIONS.canViewAchRule,
      redirectTo: '/', // Consider redirecting to 403 page
    },
    children: [
      {
        path: 'list',
        component: AchPositivePayRulesComponent,
      },
      {
        path: 'new',
        component: AchPositivePayNewRuleComponent,
        outlet: 'modal',
      },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'rules' },
];
