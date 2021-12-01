import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRoutes } from '@angular/router';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { SimpleContentExampleComponent } from './simple-content-example/simple-content-example.component';

import { ContentExampleService } from './content-example.service';

@NgModule({
  declarations: [
    SimpleContentExampleComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [
    provideRoutes([
      {
        path: '',
        component: SimpleContentExampleComponent
      }
    ]),
    ContentExampleService
  ]
})
export class ContentExampleModule { }
