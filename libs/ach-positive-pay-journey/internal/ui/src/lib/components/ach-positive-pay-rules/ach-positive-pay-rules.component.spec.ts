import {
  AchPositivePayRulesComponent,
  Translations,
} from './ach-positive-pay-rules.component';

describe('AchPositivePayRulesComponent', () => {
  let component: AchPositivePayRulesComponent;

  beforeEach(async () => {
    component = new AchPositivePayRulesComponent({} as Translations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
