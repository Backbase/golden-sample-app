import { Component } from '@angular/core';
import { ContentExampleService } from '../content-example.service';

@Component({
  selector: 'app-structured-content-example',
  templateUrl: './structured-content-example.component.html',
})
export class StructuredContentExampleComponent {
  contentFromTheServer$ = this.contentService.structuredContentExample$;
  isContentFetchingFailed$ = this.contentService.isContentFetchingFailed$;

  constructor(private contentService: ContentExampleService) { }
}
