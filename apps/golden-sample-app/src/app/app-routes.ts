import { Routes } from '@angular/router';
import { ACH_POSITIVE_PAY_ROUTE } from '@backbase/journey-bundles/ach-positive-pay';
import { CUSTOM_PAYMENT_ROUTE } from '@backbase/journey-bundles/custom-payment';
import { TRANSACTIONS_ROUTE } from '@backbase/journey-bundles/transactions';
import { TRANSFER_ROUTE } from '@backbase/journey-bundles/transfer';
import { USER_ACCOUNTS_ROUTE } from '@backbase/journey-bundles/user-accounts';
import { AuthGuard } from '@backbase/shared/feature/auth';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: TRANSACTIONS_ROUTE.path,
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
  TRANSFER_ROUTE,
  ACH_POSITIVE_PAY_ROUTE,
  TRANSACTIONS_ROUTE,
  USER_ACCOUNTS_ROUTE,
  CUSTOM_PAYMENT_ROUTE,
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () =>
      import('./error-page/error-page.module').then((m) => m.ErrorPageModule),
  },
];
