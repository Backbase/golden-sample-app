import { TestBed } from '@angular/core/testing';
import { LocaleSelectorComponent } from './locale-selector.component';
import { localesCatalog } from './locales-catalog';
import { LocalesService, LOCALES_LIST } from '@backbase/shared/util/app-core';

describe('bb-locale-selector', () => {
  let component: LocaleSelectorComponent;
  const mockLocales = ['en', 'es'];

  describe('with valid locale', () => {
    let mockLocalesService: Pick<LocalesService, 'setLocale' | 'currentLocale'>;

    beforeEach(() => {
      mockLocalesService = {
        currentLocale: 'en',
        setLocale: jest.fn(),
      };

      TestBed.configureTestingModule({
        providers: [
          LocaleSelectorComponent,
          { provide: LocalesService, useValue: mockLocalesService },
          { provide: LOCALES_LIST, useValue: mockLocales },
        ],
      });

      component = TestBed.inject(LocaleSelectorComponent);
    });

    it(`should call ngOnInit and set current language to correct locale`, () => {
      component.ngOnInit();
      expect(component.language).toEqual(localesCatalog['en']);
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

  describe('with invalid locale', () => {
    let mockLocalesService: Pick<LocalesService, 'setLocale' | 'currentLocale'>;

    beforeEach(() => {
      mockLocalesService = {
        currentLocale: 'Nan',
        setLocale: jest.fn(),
      };

      TestBed.configureTestingModule({
        providers: [
          LocaleSelectorComponent,
          { provide: LocalesService, useValue: mockLocalesService },
          { provide: LOCALES_LIST, useValue: mockLocales },
        ],
      });

      component = TestBed.inject(LocaleSelectorComponent);
    });

    it(`should call ngOnInit and set current language to empty string`, () => {
      component.ngOnInit();
      expect(component.language).toEqual(undefined);
    });
  });
});
