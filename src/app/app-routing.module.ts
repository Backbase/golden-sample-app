import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from './auth.guard';
import { TRIPLETS } from './services/entitlementsTriplets';


const routes: Routes = [
  {
    path: 'transfer',
    loadChildren: () => import('./transfer/transfer-journey-bundle.module').then(m => m.TransferJourneyBundleModule),
    data: {
      entitlements: TRIPLETS.canViewTransfer,
    },
    canActivate: [ AuthGuard, EntitlementsGuard ],
  },
  {
    path: 'positive-pay',
    loadChildren: () => import('./positive-pay/positive-pay-journey-bundle.module').then(m => m.PositivePayJourneyBundleModule),
    canActivate: [ AuthGuard ],

  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions-journey-bundle.module').then(m => m.TransactionsJourneyBundleModule),
    data: {
      entitlements: TRIPLETS.canViewTransactions,
    },
    canActivate: [ AuthGuard, EntitlementsGuard ],
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
