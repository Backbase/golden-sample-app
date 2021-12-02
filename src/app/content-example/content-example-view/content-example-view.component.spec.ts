import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentExampleViewComponent } from './content-example-view.component';

describe('ContentExampleViewComponent', () => {
  let component: ContentExampleViewComponent;
  let fixture: ComponentFixture<ContentExampleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentExampleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentExampleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
