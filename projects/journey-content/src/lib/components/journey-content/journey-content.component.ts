import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TemplateStorageService } from '../../services/template-storage.service';
import { DefaultHttpService } from 'wordpress-http-module-ang';
// import { JourneyContentService } from 'journey-content';

@Component({
  selector: 'bb-journey-content',
  templateUrl: './journey-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyContentComponent implements OnInit {
  private itemTemplateSubject = new BehaviorSubject<TemplateRef<any> | undefined>(undefined);
  public itemTemplate$ = this.itemTemplateSubject.asObservable();

  private templateDataSubject = new BehaviorSubject<any>({});
  public templateData$ = this.templateDataSubject.asObservable();

  @ContentChild('wrapper', { static: true }) 
    wrapper!: TemplateRef<any>;

  @ViewChild('defaultWrapper', { static: true })
    defaultWrapper!: TemplateRef<any>;

  @Input() contentId?: string;

  @Input() type = 'post';

  @Input()
  set template(value: string | undefined) {
    const templateRef = this.templateStorageService.templates.get(value || '');
    this.itemTemplateSubject.next(templateRef);
  }

  constructor(
    public readonly templateStorageService: TemplateStorageService,
    private wordpressHttpService: DefaultHttpService,
    // private journeyContentService: JourneyContentService,
    private cdf: ChangeDetectorRef) {
  }

  ngAfterContentInit() {
    if (!this.wrapper) {
      this.wrapper = this.defaultWrapper;
    }
  }

  ngOnInit(): void {
    let call: Observable<object> = of({});

    if (!this.contentId){
      this.itemTemplateSubject.next(this.wrapper);
      return;
    }

    if (this.type === 'media') {
      call = this.wordpressHttpService
        .mediaIdGet({
          id: this.contentId,
        });
      // call = this.journeyContentService
      //   .getMediaContent(this.contentId);
    } else {
      call = this.wordpressHttpService
        .postsIdGet({
          id: this.contentId
        });
      // call = this.journeyContentService
      //   .getContent(this.contentId);
    }

    call.subscribe((data: any) => {
      this.templateDataSubject.next(data);
      this.cdf.detectChanges();
    });

  }
}
