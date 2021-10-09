import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Inject, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TemplateStorageService } from '../../services/template-storage.service';
import { DefaultHttpService } from 'wordpress-http-module-ang';
import { JourneyContentConfiguration, JourneyContentConfigurationToken } from 'journey-content';
// import { JourneyContentService } from 'journey-content';

@Component({
  selector: 'bb-journey-content',
  templateUrl: './journey-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyContentComponent implements OnInit {
  private _config!: JourneyContentConfiguration;
  private cache: Map<string, any> = new Map();
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
    @Optional() @Inject(JourneyContentConfigurationToken) config: JourneyContentConfiguration,
    public readonly templateStorageService: TemplateStorageService,
    private wordpressHttpService: DefaultHttpService,
    // private journeyContentService: JourneyContentService,
    private cdf: ChangeDetectorRef) {
    config = config || {};
    this._config = { ...config };
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

    const keyCache = `${this.type}:${this.contentId}`;
    const cached = this.cache.get(keyCache);

    if (this._config.cache && cached) {
      this.templateDataSubject.next(cached);
      this.cdf.detectChanges();
    } else {
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
        if (this._config.cache) {
          this.cache.set(keyCache, data);
        }
        this.templateDataSubject.next(data);
        this.cdf.detectChanges();
      });
    }
  }
}
