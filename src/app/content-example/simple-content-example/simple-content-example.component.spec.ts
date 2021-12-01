import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ContentExampleService } from '../content-example.service';

import { SimpleContentExampleComponent } from './simple-content-example.component';

describe('SimpleContentExampleComponent', () => {
  let component: SimpleContentExampleComponent;
  let fixture: ComponentFixture<SimpleContentExampleComponent>;

  let contentExampleServiceSpy: jasmine.SpyObj<ContentExampleService>;

  const mockContentFromServer = 'some text content from server';

  beforeEach(async () => {
    contentExampleServiceSpy = jasmine.createSpyObj<ContentExampleService>(['simpleContentExample$']);
    Object.assign(contentExampleServiceSpy, {
      simpleContentExample$: of(mockContentFromServer)
    });

    await TestBed.configureTestingModule({
      declarations: [ SimpleContentExampleComponent ],
      providers: [
        {
          provide: ContentExampleService,
          useValue: contentExampleServiceSpy
        }
      ]
    })
    .compileComponents();

  fixture = TestBed.createComponent(SimpleContentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render content from the service', () => {
    const contentContainer = fixture.debugElement.query(By.css('[data-role="simple-content--container"]'));

    expect(contentContainer.nativeElement.innerText.trim()).toBe(mockContentFromServer);
  });
});
