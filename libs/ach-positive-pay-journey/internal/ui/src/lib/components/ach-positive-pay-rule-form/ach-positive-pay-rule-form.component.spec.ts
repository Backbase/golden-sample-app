import { AchPositivePayRuleFormTranslations } from '../../../translations-catalog';
import { AchPositivePayRuleFormComponent } from './ach-positive-pay-rule-form.component';

describe('AchPositivePayRuleFormComponent', () => {
  let component: AchPositivePayRuleFormComponent;

  beforeEach(async () => {
    component = new AchPositivePayRuleFormComponent(
      {} as AchPositivePayRuleFormTranslations
    );
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
