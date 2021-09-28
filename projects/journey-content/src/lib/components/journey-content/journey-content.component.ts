import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TemplateStorageService } from '../../services/template-storage.service';
import { JourneyContentService } from '../../services/journey-content.service';

@Component({
  selector: 'bb-journey-content',
  templateUrl: './journey-content.component.html',
  styles: [],
})
export class JourneyContentComponent implements OnInit {

  private itemTemplateSubject = new BehaviorSubject<TemplateRef<any> | undefined>(undefined);
  public itemTemplate$ = this.itemTemplateSubject.asObservable();

  private templateDataSubject = new BehaviorSubject<any>({});
  public templateData$ = this.templateDataSubject.asObservable();

  @Input() contentId = '';

  @Input() type = 'post';

  @Input() 
  set template(value: string | undefined) {
    const templateRef = this.templateStorageService.templates.get(value || '');
    this.itemTemplateSubject.next(templateRef);
  }

  constructor(
    private journeyContentService: JourneyContentService,
    public readonly templateStorageService: TemplateStorageService) {
    }

  ngOnInit(): void {
    let call: Observable<object> = of({});

    // Avoid executing any call to server if the template 
    // doesn't exist or has not been provided.
    if (this.itemTemplateSubject.getValue() === undefined) {
      return;
    }

    if (this.type === 'media') {
      call = this.journeyContentService
      .getMediaContent(this.contentId)
    } else {
      call = this.journeyContentService
      .getContent(this.contentId)
    }

    call.subscribe((data: any) => {
      this.templateDataSubject.next(data);
    });
    
  }
}
