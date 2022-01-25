import { LocaleSelectorComponent } from './locale-selector.component';
import { LocalesService } from './locales.service';

describe('bb-locale-selector', () => {
  let component: LocaleSelectorComponent;
  const mockLocales = ['en', 'es'];
  const mockLocation: Pick<Location, 'href' | 'origin'> = {
    href: 'test',
    origin: '',
  };
  const mockDocument: Pick<Document, 'location'> = {
    location: mockLocation as Location,
  };
  let mockLocalesService: Pick<
    LocalesService,
    'setLocaleCookie' | 'currentLocale'
  > = {
    currentLocale: 'en',
    setLocaleCookie: jest.fn(),
  };

  function createComponent() {
    component = new LocaleSelectorComponent(
      mockLocalesService as LocalesService,
      mockLocales,
      mockDocument as Document
    );
  }

  beforeEach(() => {
    createComponent();
  });

  it(`should call ngOnInit and set current language to correct locale`, () => {
    component.ngOnInit();
    expect(component.language).toEqual('en');
  });

  it(`should call ngOnInit and set current language to empty string`, () => {
    mockLocalesService = {
      currentLocale: 'Nan',
      setLocaleCookie: jest.fn(),
    };
    createComponent();
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
