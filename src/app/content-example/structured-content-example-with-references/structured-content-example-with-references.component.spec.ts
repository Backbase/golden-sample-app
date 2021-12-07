import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ContentExampleService } from '../content-example.service';
import { ContactUsData } from '../models';

import { StructuredContentExampleWithReferencesComponent } from './structured-content-example-with-references.component';

describe('StructuredContentExampleWithReferencesComponent', () => {
  let component: StructuredContentExampleWithReferencesComponent;
  let fixture: ComponentFixture<StructuredContentExampleWithReferencesComponent>;

  let contentExampleServiceSpy: jasmine.SpyObj<ContentExampleService>;
  let mockIsContentFetchingFailed$$: BehaviorSubject<boolean>;
  let mockStructuredContentWithRefsExample$$: BehaviorSubject<ContactUsData | null>;

  const mockContentFromServer = {
    title: 'some title',
    email: 'some@another.com',
    socialLink: {
      link: 'link',
      linkText: 'link text',
      imageLink: 'image link'
    }
  } as ContactUsData;

  beforeEach(async () => {
    contentExampleServiceSpy = jasmine.createSpyObj<ContentExampleService>(['simpleContentExample$']);
    mockIsContentFetchingFailed$$ = new BehaviorSubject<boolean>(false);
    mockStructuredContentWithRefsExample$$ = new BehaviorSubject<ContactUsData | null>(mockContentFromServer);
    Object.assign(contentExampleServiceSpy, {
      structuredContentWithRefsExample$: mockStructuredContentWithRefsExample$$.asObservable(),
      isContentFetchingFailed$: mockIsContentFetchingFailed$$.asObservable(),
    });
    await TestBed.configureTestingModule({
      declarations: [ StructuredContentExampleWithReferencesComponent ],
      providers: [
        {
          provide: ContentExampleService,
          useValue: contentExampleServiceSpy,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructuredContentExampleWithReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render content from the service', () => {
    const contentContainer = fixture.debugElement.query(By.css('[data-role="structured-content-wth-ref--container"]'));

    expect(contentContainer.nativeElement.innerText.trim()).not.toBeFalsy();
  });

  it('should not render error message by default', () => {
    const errorMessage = fixture.debugElement.query(By.css('[data-role="structured-content-with-ref--error-message"]'));

    expect(errorMessage).toBeNull();
  });

  it('should render error message in case of content server error', () => {
    mockIsContentFetchingFailed$$.next(true);
    fixture.detectChanges();


    const errorMessage = fixture.debugElement.query(By.css('[data-role="structured-content-with-ref--error-message"]'));

    expect(errorMessage).not.toBeNull();
  });

  it('should show skeleton if there is no fetching error, but the content is still loading', () => {
    mockStructuredContentWithRefsExample$$.next(null);
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('ngx-skeleton-loader'));

    expect(skeleton).not.toBeNull();
  });
});
