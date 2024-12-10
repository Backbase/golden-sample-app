import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UserContextGuard } from '@backbase-gsa/shared';
import { environment } from '../environments/environment';

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
  ...environment.journeyBundles,
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
