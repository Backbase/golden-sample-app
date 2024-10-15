import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  triplets,
  UserContextGuard,
  ViewWrapperComponent,
} from '@backbase-gsa/shared';
import { withEntitlements } from '@backbase/foundation-ang/entitlements';

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
    path: 'error',
    loadChildren: () =>
      import('./error-page/error-page.module').then((m) => m.ErrorPageModule),
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./user-accounts/user-accounts.module').then(
        (m) => m.UserAccountsModule
      ),
    canActivate: [AuthGuard, UserContextGuard],
  },
  {
    path: 'ach-positive-pay',
    loadChildren: () =>
      import('@backbase-gsa/journey-bundles/ach-positive-pay'),
    canActivate: [
      AuthGuard,
      UserContextGuard,
      withEntitlements(triplets.canViewAchRule),
    ],
  },
  {
    path: 'transactions',
    loadChildren: () => import('@backbase-gsa/journey-bundles/transactions'),
    canActivate: [
      AuthGuard,
      UserContextGuard,
      withEntitlements(triplets.canViewTransactions),
    ],
  },
  {
    path: 'transfer',
    loadChildren: () => import('@backbase-gsa/journey-bundles/transfer'),
    canActivate: [AuthGuard, UserContextGuard],
  },
  {
    path: 'transfer-internal',
    component: ViewWrapperComponent,
    loadChildren: () => import('@backbase-gsa/journey-bundles/custom-payment'),
    canActivate: [AuthGuard, UserContextGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () =>
      import('./error-page/error-page.module').then((m) => m.ErrorPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
