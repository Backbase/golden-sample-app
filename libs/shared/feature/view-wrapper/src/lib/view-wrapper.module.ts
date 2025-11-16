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
  imports: [CommonModule, RouterModule, ViewWrapperComponent],
  providers: [provideRouter(routes)],
  exports: [RouterModule],
})
export class ViewWrapperModule {}
