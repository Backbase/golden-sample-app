import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchPositivePayJourneyComponent } from './ach-positive-pay-journey.component';

describe('AchPositivePayJourneyComponent', () => {
  let component: AchPositivePayJourneyComponent;
  let fixture: ComponentFixture<AchPositivePayJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchPositivePayJourneyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchPositivePayJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
