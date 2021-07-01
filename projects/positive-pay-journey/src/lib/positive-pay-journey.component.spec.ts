import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositivePayJourneyComponent } from './positive-pay-journey.component';

describe('PositivePayJourneyComponent', () => {
  let component: PositivePayJourneyComponent;
  let fixture: ComponentFixture<PositivePayJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositivePayJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositivePayJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
