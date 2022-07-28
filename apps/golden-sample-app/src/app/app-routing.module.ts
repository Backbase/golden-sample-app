import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from './guards/auth.guard';
import { triplets } from './services/entitlementsTriplets';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'transactions',
  },
  {
    path: 'select-context',
    loadChildren: () =>
      import('./user-context/user-context.module').then(
        (m) => m.UserContextModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'transfer',
    loadChildren: () =>
      import('./transfer/transfer-journey-bundle.module').then(
        (m) => m.TransferJourneyBundleModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'positive-pay',
    loadChildren: () =>
      import('./positive-pay/positive-pay-journey-bundle.module').then(
        (m) => m.PositivePayJourneyBundleModule
      ),
    canActivate: [AuthGuard, EntitlementsGuard],
    data: {
      entitlements: triplets.canViewPositivePay,
    },
  },
  // {
  //   path: 'ach-positive-pay',
  //   loadChildren: () =>
  //     import('./ach-positive-pay/ach-positive-pay-journey-bundle.module').then(
  //       (m) => m.AchPositivePayJourneyBundleModule
  //     ),
  //   canActivate: [AuthGuard, EntitlementsGuard],
  //   data: {
  //     entitlements: triplets.canViewAchRule,
  //   },
  // },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions-journey-bundle.module').then(
        (m) => m.TransactionsJourneyBundleModule
      ),
    data: {
      entitlements: triplets.canViewTransactions,
    },
    canActivate: [AuthGuard, EntitlementsGuard],
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./user-accounts/user-accounts.module').then(
        (m) => m.UserAccountsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'transactions',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
