import { Routes } from '@angular/router';
import { AchPositivePayJourneyComponent } from './views/ach-positive-pay-journey/ach-positive-pay-journey.component';
import { AchPositivePayRulesComponent } from './views/ach-positive-pay-rules/ach-positive-pay-rules.component';
import { AchPositivePayNewRuleComponent } from './views/ach-positive-pay-new-rule/ach-positive-pay-new-rule.component';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { PERMISSIONS } from './constants/permissions';

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
