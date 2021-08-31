import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from './auth.guard';
import { IconsComponent } from './icons/icons.component';


const routes: Routes = [
  {
    path: 'transfer',
    loadChildren: () => import('./transfer/transfer-journey-bundle.module').then(m => m.TransferJourneyBundleModule),
    data: {
      entitlements: 'Payments.ACHCreditTransfer.view',
    },
    canActivate: [ AuthGuard, EntitlementsGuard ],

  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions-journey-bundle.module').then(m => m.TransactionsJourneyBundleModule),
    canActivate: [ AuthGuard ],
  },
  {
    path: 'icons',
    component: IconsComponent
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
