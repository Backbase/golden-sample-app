import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideRoutes, RouterModule } from '@angular/router';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { ProductItemBasicAccountModule } from '@backbase/ui-ang/product-item-basic-account';
import {
  USER_ACCOUNTS_TRANSLATIONS,
  UserAccountsViewComponent,
} from './user-accounts-view/user-accounts-view.component';

@NgModule({
  declarations: [UserAccountsViewComponent],
  imports: [
    CommonModule,
    LoadingIndicatorModule,
    ProductItemBasicAccountModule,
    RouterModule,
  ],
  providers: [
    provideRoutes([
      {
        path: '',
        component: UserAccountsViewComponent,
      },
    ]),
    {
      provide: USER_ACCOUNTS_TRANSLATIONS,
      useValue: {},
    },
  ],
})
export class UserAccountsModule {}
