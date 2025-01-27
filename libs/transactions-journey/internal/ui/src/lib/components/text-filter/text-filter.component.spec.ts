import "@angular/localize/init";
import { TextFilterComponent } from './text-filter.component';
import { Translations } from './translations.provider';

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;

  beforeEach(() => {
    component = new TextFilterComponent({} as Translations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
