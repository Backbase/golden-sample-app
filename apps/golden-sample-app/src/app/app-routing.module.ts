import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from './auth/guard/auth.guard';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { triplets } from './services/entitlementsTriplets';
import { UserContextGuard } from './user-context/user-context.guard';

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
    path: 'transfer',
    loadChildren: () =>
      import('./transfer/transfer-journey-bundle.module').then(
        (m) => m.TransferJourneyBundleModule
      ),
    canActivate: [AuthGuard, UserContextGuard],
  },
  {
    path: 'ach-positive-pay',
    loadChildren: () =>
      import('./ach-positive-pay/ach-positive-pay-journey-bundle.module').then(
        (m) => m.AchPositivePayJourneyBundleModule
      ),
    canActivate: [AuthGuard, UserContextGuard, EntitlementsGuard],
    data: {
      entitlements: triplets.canViewAchRule,
    },
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions-journey-bundle.module').then(
        (m) => m.TransactionsJourneyBundleModule
      ),
    data: {
      // entitlements: triplets.canViewTransactions,
    },
    canActivate: [AuthGuard, UserContextGuard, EntitlementsGuard],
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
    path: 'transfer-internal',
    component: ViewWrapperComponent,
    loadChildren: () =>
      import('./custom-payment/initiate-payment-journey-bundle.module').then(
        (m) => m.CustomPaymentJourneyBundleModule
      ),
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
  declarations: [ViewWrapperComponent],
  imports: [RouterModule.forRoot(routes, { errorHandler: (error) => console.error('Navigation error:', error) }), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
