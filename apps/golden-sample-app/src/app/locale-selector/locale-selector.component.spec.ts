import { LocaleSelectorComponent } from './locale-selector.component';

describe('bb-locale-selector', () => {
  let component: LocaleSelectorComponent;
  const mockLocales = ['en', 'es'];
  const mockDocument: any = {
    location: {
      href: 'test',
      origin: '',
    },
  };
  const mockLocalesService: any = {};

  beforeEach(() => {
    component = new LocaleSelectorComponent(
      mockLocalesService,
      mockLocales,
      mockDocument
    );
  });

  it(`should call ngOnInit and set current language to correct locale`, () => {
    mockLocalesService.currentLocale = 'en';
    component.ngOnInit();
    expect(component.language).toEqual('en');
  });

  it(`should call ngOnInit and set current language to empty string`, () => {
    mockLocalesService.currentLocale = 'NAN';
    component.ngOnInit();
    expect(component.language).toEqual('');
  });

  it('should load all the languages configured', () => {
    const locales = mockLocales.map(
      (locale) => component.localesCatalog[locale].language
    );
    expect(locales).toEqual(['English', 'Spanish']);
  });

  it(`should set a new cookie value and refresh the page
  by calling the respective services after selecting a language`, () => {
    mockLocalesService.setLocaleCookie = jest.fn();
    component.language = 'es';
    expect(mockLocalesService.setLocaleCookie).toHaveBeenCalledWith('es');
    expect(mockDocument.location.origin).toBe(mockDocument.location.href);
  });
});
