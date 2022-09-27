import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideRoutes } from '@angular/router';
import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { ProductItemBasicAccountModule } from '@backbase/ui-ang/product-item-basic-account';
import { UserAccountsViewComponent } from './user-accounts-view/user-accounts-view.component';
import { UserAccountsService } from './user-accounts.service';

@NgModule({
  declarations: [UserAccountsViewComponent],
  imports: [
    CommonModule,
    LoadingIndicatorModule,
    ProductItemBasicAccountModule
  ],
  providers: [
    provideRoutes([
      {
        path: '',
        component: UserAccountsViewComponent,
      },
    ]),
    UserAccountsService,
  ],
})
export class UserAccountsModule { }
