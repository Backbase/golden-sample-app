import { Component } from '@angular/core';
import { ContentExampleService } from '../content-example.service';

@Component({
  selector: 'app-structured-content-example-with-references',
  templateUrl: './structured-content-example-with-references.component.html',
})
export class StructuredContentExampleWithReferencesComponent {
  contentFromTheServer$ = this.contentService.structuredContentWithRefsExample$;
  isContentFetchingFailed$ = this.contentService.isContentFetchingFailed$;

  constructor(private contentService: ContentExampleService) { }

}
