import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';
import { EmptyStateModule } from '@backbase/ui-ang/empty-state';

@NgModule({
  declarations: [ErrorPageComponent],
  imports: [
    CommonModule,
    EmptyStateModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorPageComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ErrorPageModule {}
