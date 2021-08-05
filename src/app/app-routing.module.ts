import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: 'transfer',
    loadChildren: () => import('./transfer/transfer-journey-bundle.module').then(m => m.TransferJourneyBundleModule),
    canActivate: [ AuthGuard, EntitlementsGuard ],
    data: {
      entitlements: 'Transfers.make.view'
    }
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
    path: 'todo',
    loadChildren: () => import('todo-journey').then(m => m.TodoJourneyModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'heroes',
    loadChildren: () => import('heroes-journey').then(m => m.HeroesJourneyModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
