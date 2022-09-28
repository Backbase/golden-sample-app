import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';
import { ErrorCommonStateModule } from '@backbase/ui-ang/common-error-state';

@NgModule({
  declarations: [ErrorPageComponent],
  imports: [
    CommonModule,
    ErrorCommonStateModule,
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
