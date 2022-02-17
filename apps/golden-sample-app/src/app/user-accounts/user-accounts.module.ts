import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideRoutes } from '@angular/router';
import { UserAccountsViewComponent } from './user-accounts-view/user-accounts-view.component';
import { UserAccountsService } from './user-accounts.service';

@NgModule({
  declarations: [UserAccountsViewComponent],
  imports: [CommonModule],
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
export class UserAccountsModule {}
