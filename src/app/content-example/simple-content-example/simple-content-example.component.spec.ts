import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleContentExampleComponent } from './simple-content-example.component';

describe('SimpleContentExampleComponent', () => {
  let component: SimpleContentExampleComponent;
  let fixture: ComponentFixture<SimpleContentExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleContentExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleContentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
