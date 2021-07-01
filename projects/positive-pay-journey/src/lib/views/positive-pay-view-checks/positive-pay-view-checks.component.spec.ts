import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositivePayViewChecksComponent } from './positive-pay-view-checks.component';

describe('PositivePayViewChecksComponent', () => {
  let component: PositivePayViewChecksComponent;
  let fixture: ComponentFixture<PositivePayViewChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositivePayViewChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositivePayViewChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
