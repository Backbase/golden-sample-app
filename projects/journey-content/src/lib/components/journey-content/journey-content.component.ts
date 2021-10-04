import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TemplateStorageService } from '../../services/template-storage.service';
import { JourneyContentService } from '../../services/journey-content.service';

@Component({
  selector: 'bb-journey-content',
  templateUrl: './journey-content.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyContentComponent implements OnInit {

  private itemTemplateSubject = new BehaviorSubject<TemplateRef<any> | undefined>(undefined);
  public itemTemplate$ = this.itemTemplateSubject.asObservable();

  private templateDataSubject = new BehaviorSubject<any>(null);
  public templateData$ = this.templateDataSubject.asObservable();

  @ContentChild('wrapper', { static: true }) wrapper: TemplateRef<any> | null = null; 

  @ViewChild('defaultWrapper', { static: true }) defaultWrapper: TemplateRef<any> | null = null

  @Input() contentId = '';

  @Input() type = 'post';

  @Input()
  set template(value: string | undefined) {
    const templateRef = this.templateStorageService.templates.get(value || '');
    this.itemTemplateSubject.next(templateRef);
  }

  constructor(
    private journeyContentService: JourneyContentService,
    public readonly templateStorageService: TemplateStorageService,
    private cdf: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    if (!this.wrapper) {
      this.wrapper = this.defaultWrapper;
    }
  }

  ngOnInit(): void {
    let call: Observable<object> = of({});

    if (!this.contentId){
      return;
    }

    console.log('content id:', this.contentId);

    if (this.type === 'media') {
      call = this.journeyContentService
        .getMediaContent(this.contentId)
    } else {
      call = this.journeyContentService
        .getContent(this.contentId)
    }

    call.subscribe((data: any) => {
      this.templateDataSubject.next(data);
      this.cdf.detectChanges();
    });

  }
}
