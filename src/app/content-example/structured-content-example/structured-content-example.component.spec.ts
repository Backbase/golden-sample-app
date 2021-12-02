import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredContentExampleComponent } from './structured-content-example.component';

describe('StructuredContentExampleComponent', () => {
  let component: StructuredContentExampleComponent;
  let fixture: ComponentFixture<StructuredContentExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructuredContentExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredContentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
