import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRoutes } from '@angular/router';
import { SimpleContentExampleComponent } from './simple-content-example/simple-content-example.component';

@NgModule({
  declarations: [
    SimpleContentExampleComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    provideRoutes([
      {
        path: '',
        component: SimpleContentExampleComponent
      }
    ])
  ]
})
export class ContentExampleModule { }
