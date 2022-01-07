import { AchPositivePayRulesComponent } from './ach-positive-pay-rules.component';

describe('AchPositivePayRulesComponent', () => {
  let component: AchPositivePayRulesComponent;

  beforeEach(async () => {
    component = new AchPositivePayRulesComponent();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
