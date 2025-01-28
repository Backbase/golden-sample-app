import '@angular/localize/init';
import { TextFilterComponent, Translations } from './text-filter.component';

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;

  beforeEach(() => {
    component = new TextFilterComponent({} as Translations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
