import { AchPositivePayRulesComponent } from './ach-positive-pay-rules.component';
import { Translations } from './translations.provider';

describe('AchPositivePayRulesComponent', () => {
  let component: AchPositivePayRulesComponent;

  beforeEach(async () => {
    component = new AchPositivePayRulesComponent({} as Translations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
