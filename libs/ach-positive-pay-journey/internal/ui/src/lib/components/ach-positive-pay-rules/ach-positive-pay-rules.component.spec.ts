import { AchPositivePayRulesTranslations } from '../../../translations-catalog';
import { AchPositivePayRulesComponent } from './ach-positive-pay-rules.component';

describe('AchPositivePayRulesComponent', () => {
  let component: AchPositivePayRulesComponent;

  beforeEach(async () => {
    component = new AchPositivePayRulesComponent(
      {} as AchPositivePayRulesTranslations
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
