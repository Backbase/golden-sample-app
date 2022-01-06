import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchPositivePayNewRuleComponent } from './ach-positive-pay-new-rule.component';

describe('AchPositivePayNewRuleComponent', () => {
  let component: AchPositivePayNewRuleComponent;
  let fixture: ComponentFixture<AchPositivePayNewRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchPositivePayNewRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchPositivePayNewRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
