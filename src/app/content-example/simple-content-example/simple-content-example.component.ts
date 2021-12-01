import { Component } from '@angular/core';
import { ContentExampleService } from '../content-example.service';

@Component({
  selector: 'app-simple-content-example',
  templateUrl: './simple-content-example.component.html',
  styleUrls: ['./simple-content-example.component.sass']
})
export class SimpleContentExampleComponent {
  contentFromTheServer$ = this.contentService.simpleContentExample$;

  constructor(private contentService: ContentExampleService) { }
}
