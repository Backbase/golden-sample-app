import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchPositivePayRulesComponent } from './ach-positive-pay-rules.component';

describe('AchPositivePayRulesComponent', () => {
  let component: AchPositivePayRulesComponent;
  let fixture: ComponentFixture<AchPositivePayRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchPositivePayRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchPositivePayRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
