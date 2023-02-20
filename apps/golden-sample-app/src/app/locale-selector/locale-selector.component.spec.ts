import { LocaleSelectorComponent } from './locale-selector.component';
import { localesCatalog } from './locales-catalog';
import { LocalesService } from './locales.service';

describe('bb-locale-selector', () => {
  let component: LocaleSelectorComponent;
  const mockLocales = ['en', 'es'];
  let mockLocalesService: Pick<LocalesService, 'setLocale' | 'currentLocale'> =
    {
      currentLocale: 'en',
      setLocale: jest.fn(),
    };

  function createComponent() {
    component = new LocaleSelectorComponent(
      mockLocalesService as LocalesService,
      mockLocales
    );
  }

  beforeEach(() => {
    createComponent();
  });

  it(`should call ngOnInit and set current language to correct locale`, () => {
    component.ngOnInit();
    expect(component.language).toEqual(localesCatalog['en']);
  });

  it(`should call ngOnInit and set current language to empty string`, () => {
    mockLocalesService = {
      currentLocale: 'Nan',
      setLocale: jest.fn(),
    };
    createComponent();
    component.ngOnInit();
    expect(component.language).toEqual(undefined);
  });

  it('should load all the languages configured', () => {
    component.ngOnInit();
    const locales = mockLocales.map(
      (locale) =>
        component.localesCatalog.find((x) => x.code === locale)?.language
    );
    expect(locales).toEqual(['English', 'Spanish']);
  });

  it(`should set a new value
  by calling the respective services after selecting a language`, () => {
    mockLocalesService.setLocale = jest.fn();
    component.language = {
      language: 'Spanish',
      code: 'es',
    };
    expect(mockLocalesService.setLocale).toHaveBeenCalledWith('es');
  });
});
