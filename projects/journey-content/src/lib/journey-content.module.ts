import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JourneyContentComponent } from './components/journey-content/journey-content.component';
import { TemplateStorageComponent } from './components/template-storage/template-storage.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TemplateIdDirective } from './directives/template-id.directive';
import { JourneyContentService} from './services/journey-content.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [JourneyContentComponent, TemplateStorageComponent, TemplateIdDirective, SafeHtmlPipe],
  providers: [JourneyContentService, SafeHtmlPipe],
  exports: [JourneyContentComponent, TemplateStorageComponent, TemplateIdDirective, SafeHtmlPipe],
})
export class JourneyContentModule {
}