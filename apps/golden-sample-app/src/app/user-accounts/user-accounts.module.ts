import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideRoutes, RouterModule } from '@angular/router';
import { ButtonModule } from '@backbase/ui-ang/button';

import { UserAccountsViewComponent } from './user-accounts-view/user-accounts-view.component';

@NgModule({
  declarations: [UserAccountsViewComponent],
  imports: [CommonModule, ButtonModule, RouterModule],
  providers: [
    provideRoutes([
      {
        path: '',
        component: UserAccountsViewComponent,
      },
    ]),
  ],
})
export class UserAccountsModule {}
