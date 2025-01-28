import {
  AchPositivePayRuleFormComponent,
  Translations,
} from './ach-positive-pay-rule-form.component';

describe('AchPositivePayRuleFormComponent', () => {
  let component: AchPositivePayRuleFormComponent;

  beforeEach(async () => {
    component = new AchPositivePayRuleFormComponent({} as Translations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCheckingAccountSelect', () => {
    it('should emit selected account', () => {
      jest.spyOn(component.selectAccountId, 'emit');
      component.onCheckingAccountSelect({});
      expect(component.selectAccountId.emit).toHaveBeenCalledWith({});
    });
  });
});
