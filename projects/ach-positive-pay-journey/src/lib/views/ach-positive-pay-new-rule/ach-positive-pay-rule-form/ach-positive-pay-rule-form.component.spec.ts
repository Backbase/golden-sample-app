import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchPositivePayRuleFormComponent } from './ach-positive-pay-rule-form.component';

describe('AchPositivePayRuleFormComponent', () => {
  let component: AchPositivePayRuleFormComponent;
  let fixture: ComponentFixture<AchPositivePayRuleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchPositivePayRuleFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchPositivePayRuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
