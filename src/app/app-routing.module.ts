import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: 'transfer',
    loadChildren: () => import('./transfer/transfer-journey-bundle.module').then(m => m.TransferJourneyBundleModule),
    canActivate: [ AuthGuard ],

  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions-journey-bundle.module').then(m => m.TransactionsJourneyBundleModule),
    canActivate: [ AuthGuard ],

  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [ AuthGuard ]
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
