import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContentTemplateDirective, SafeHtmlPipe, TemplateStorageComponent, TemplateStorageService } from 'journey-content';
import { JourneyContentComponent } from './components/journey-content/journey-content.component';
import { JourneyContentService} from './services/journey-content.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [JourneyContentComponent, TemplateStorageComponent, ContentTemplateDirective, SafeHtmlPipe],
  providers: [JourneyContentService, TemplateStorageService, SafeHtmlPipe],
  exports: [JourneyContentComponent, TemplateStorageComponent, ContentTemplateDirective, SafeHtmlPipe],
})
export class JourneyContentModule {
}