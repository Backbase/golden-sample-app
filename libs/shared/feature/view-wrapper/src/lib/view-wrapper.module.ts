import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { ViewWrapperComponent } from './view-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: ViewWrapperComponent,
  },
];

@NgModule({
  declarations: [ViewWrapperComponent],
  imports: [CommonModule, RouterModule],
  providers: [provideRouter(routes)],
  exports: [RouterModule],
})
export class ViewWrapperModule {}
