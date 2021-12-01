import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { ContentExampleService } from '../content-example.service';

import { SimpleContentExampleComponent } from './simple-content-example.component';

describe('SimpleContentExampleComponent', () => {
  let component: SimpleContentExampleComponent;
  let fixture: ComponentFixture<SimpleContentExampleComponent>;

  let contentExampleServiceSpy: jasmine.SpyObj<ContentExampleService>;
  let mockIsContentFetchingFailed$$: BehaviorSubject<boolean>;
  let mockSimpleContentExample$$: BehaviorSubject<string | null>;

  const mockContentFromServer = 'some text content from server';

  beforeEach(async () => {
    contentExampleServiceSpy = jasmine.createSpyObj<ContentExampleService>(['simpleContentExample$']);
    mockIsContentFetchingFailed$$ = new BehaviorSubject<boolean>(false);
    mockSimpleContentExample$$ = new BehaviorSubject<string | null>(mockContentFromServer);
    Object.assign(contentExampleServiceSpy, {
      simpleContentExample$: mockSimpleContentExample$$.asObservable(),
      isContentFetchingFailed$: mockIsContentFetchingFailed$$.asObservable(),
    });

    await TestBed.configureTestingModule({
      declarations: [SimpleContentExampleComponent],
      providers: [
        {
          provide: ContentExampleService,
          useValue: contentExampleServiceSpy,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

  fixture = TestBed.createComponent(SimpleContentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render content from the service', () => {
    const contentContainer = fixture.debugElement.query(By.css('[data-role="simple-content--container"]'));

    expect(contentContainer.nativeElement.innerText.trim()).toBe(mockContentFromServer);
  });

  it('should not render error message by default', () => {
    const errorMessage = fixture.debugElement.query(By.css('[data-role="simple-content--error-message"]'));

    expect(errorMessage).toBeNull();
  });

  it('should render error message in case of content server error', () => {
    mockIsContentFetchingFailed$$.next(true);
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('[data-role="simple-content--error-message"]'));

    expect(errorMessage).not.toBeNull();
  });

  it('should show skeleton if there is no fetching error, but the content is still loading', () => {
    mockSimpleContentExample$$.next(null);
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('ngx-skeleton-loader'));

    expect(skeleton).not.toBeNull();
  });
});
