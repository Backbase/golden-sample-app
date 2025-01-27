import { AchPositivePayRuleFormComponent } from './ach-positive-pay-rule-form.component';
import { Translations } from './translations.provider';

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
