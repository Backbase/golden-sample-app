import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Inject, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { DefaultHttpService } from 'wordpress-http-module-ang';
import { TemplateStorageService } from '../../services/template-storage.service';
import { JourneyContentConfiguration, JourneyContentConfigurationToken } from '../../services/journey-content.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'bb-journey-content',
  templateUrl: './journey-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyContentComponent implements OnInit {
  private _config!: JourneyContentConfiguration;

  private callFailedSubject = new BehaviorSubject<boolean>(false);
  public callFailed$ = this.callFailedSubject.asObservable();

  private itemTemplateSubject = new BehaviorSubject<TemplateRef<any> | undefined>(undefined);
  public itemTemplate$ = this.itemTemplateSubject.asObservable();

  private templateDataSubject = new BehaviorSubject<any>({});
  public templateData$ = this.templateDataSubject.asObservable();

  @ContentChild('wrapper', { static: true }) 
    wrapper!: TemplateRef<any>;

  @ViewChild('defaultWrapper', { static: true })
    defaultWrapper!: TemplateRef<any>;

  @Input() contentId?: string;

  @Input() type = 'posts';

  @Input()
  set template(value: string | undefined) {
    const templateRef = this.templateStorageService.templates.get(value || '');
    this.itemTemplateSubject.next(templateRef);
  }

  constructor(
    @Optional() @Inject(JourneyContentConfigurationToken) config: JourneyContentConfiguration,
    public readonly templateStorageService: TemplateStorageService,
    private wordpressHttpService: DefaultHttpService,
    private cdf: ChangeDetectorRef) {
    config = config || {};
    this._config = { ...config };
  }

  private errorHandler(error: HttpErrorResponse) {
    this.callFailedSubject.next(true);
    return throwError(error.message || "server error.");
  }

  ngAfterContentInit() {
    if (!this.wrapper) {
      this.wrapper = this.defaultWrapper;
    }
  }

  ngOnInit(): void {
    let call: Observable<object> = of({});

    if (!this.contentId){
      this.templateDataSubject.next({});
      this.itemTemplateSubject.next(this.wrapper);
      return;
    }

    const getParams = { id: this.contentId };

    if (this.type === 'media') {
      call = this.wordpressHttpService
        .mediaIdGet(getParams);
    } else {
      call = this.wordpressHttpService
        .postsIdGet(getParams);
    }

    call = call
    .pipe(
      catchError(this.errorHandler.bind(this)),
    );

    if (this._config.cache) {
      call = call
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }

    call.subscribe((data: any) => {
      this.templateDataSubject.next(data);
      this.cdf.detectChanges();
    });
  }
}
