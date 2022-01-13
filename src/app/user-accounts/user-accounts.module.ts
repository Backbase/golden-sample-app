import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountsViewComponent } from './user-accounts-view/user-accounts-view.component';
import { provideRoutes } from '@angular/router';



@NgModule({
  declarations: [UserAccountsViewComponent],
  imports: [
    CommonModule
  ],
  providers: [
    provideRoutes([{
      path: '',
      component: UserAccountsViewComponent
    }])
  ]
})
export class UserAccountsModule { }
