import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRoutes } from '@angular/router';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { SimpleContentExampleComponent } from './simple-content-example/simple-content-example.component';
import { StructuredContentExampleComponent } from './structured-content-example/structured-content-example.component';
import { ContentExampleViewComponent } from './content-example-view/content-example-view.component';

import { ContentExampleService } from './content-example.service';

@NgModule({
  declarations: [
    SimpleContentExampleComponent,
    StructuredContentExampleComponent,
    ContentExampleViewComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [
    provideRoutes([
      {
        path: '',
        component: ContentExampleViewComponent
      }
    ]),
    ContentExampleService
  ]
})
export class ContentExampleModule { }
