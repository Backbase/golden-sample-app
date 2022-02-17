import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectContextWidgetModule } from '@backbase/select-context-widget-ang';
import { UserContextComponent } from './user-context.component';

@NgModule({
  declarations: [UserContextComponent],
  imports: [
    CommonModule,
    SelectContextWidgetModule,
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
