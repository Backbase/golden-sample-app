import '@angular/localize/init';
import { TextFilterComponent } from './text-filter.component';
import { TransactionsJourneyTextFilterTranslations } from '../../../translations-catalog';

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;

  beforeEach(() => {
    component = new TextFilterComponent(
      {} as Partial<TransactionsJourneyTextFilterTranslations>
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
