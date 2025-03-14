import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectContextModule } from '@backbase/select-context';
import { UserContextComponent } from './user-context.component';

@NgModule({
  declarations: [UserContextComponent],
  imports: [
    CommonModule,
    SelectContextModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserContextComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class UserContextModule {}
