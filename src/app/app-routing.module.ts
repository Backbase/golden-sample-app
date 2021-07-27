import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@backbase/foundation-ang/auth';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canActivate: [EntitlementsGuard],
  },
  {
    path: 'todo',
    loadChildren: () => import('todo-journey').then((m) => m.TodoJourneyModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'heroes',
    loadChildren: () => import('heroes-journey').then((m) => m.HeroesJourneyModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'positive-pay',
    loadChildren: () => import('@backbase/positive-pay-journey-ang').then((m) => m.PositivePayJourneyModule),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
