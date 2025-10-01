import { DOCUMENT, LocationStrategy } from '@angular/common';
import { LocalesService } from './locales.service';
import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';

describe('LocalesService', () => {
  let service: LocalesService;

  let locationStrategy: jest.Mocked<LocationStrategy>;

  let document: Pick<Document, 'cookie' | 'location'>;

  const mockLocale = 'en';

  beforeEach(() => {
    locationStrategy = {
      getBaseHref: jest.fn(() => '/test-app/en/'),
      path: jest.fn(() => '/test-app/en/some/path'),
    } as Partial<LocationStrategy> as jest.Mocked<LocationStrategy>;

    document = {
      cookie: '',
      location: {
        href: '/test-app/en/some/path',
      } as Location,
    };
    TestBed.configureTestingModule({
      providers: [
        LocalesService,
        { provide: LocationStrategy, useValue: locationStrategy },
        { provide: LOCALE_ID, useValue: mockLocale },
        { provide: DOCUMENT, useValue: document as Document },
      ],
    });
    service = TestBed.inject(LocalesService);
  });

  describe('currentLocale', () => {
    it('should return current locale', () => {
      expect(service.currentLocale).toEqual('en');
    });
  });

  describe('setLocale', () => {
    describe('when application root is empty (/)', () => {
      it('should set locale cookie', () => {
        locationStrategy.getBaseHref.mockReturnValueOnce('/en/');
        locationStrategy.path.mockReturnValueOnce('/en/some/path');

        service.setLocale('nl');
        expect(document.cookie).toEqual(
          'bb-locale=nl; path=/; expires=Tue, 19 Jan 2038 04:14:07 GMT; secure; samesite=Lax;'
        );
      });

      it('should redirect when new locale is different from current locale', () => {
        locationStrategy.getBaseHref.mockReturnValueOnce('/en/');
        locationStrategy.path.mockReturnValueOnce('/en/some/path');

        service.setLocale('nl');
        expect(document.location.href).toEqual('/nl/some/path');
      });

      it('should not redirect when new locale is the same as current locale', () => {
        locationStrategy.getBaseHref.mockReturnValueOnce('/en/');
        locationStrategy.path.mockReturnValueOnce('/en/some/path');
        document.location.href = '/en/some/path';

        service.setLocale('en');
        expect(document.location.href).toEqual('/en/some/path');
      });
    });

    describe('when application root is not empty (/test-app/)', () => {
      it('should set locale cookie', () => {
        service.setLocale('nl');
        expect(document.cookie).toEqual(
          'bb-locale=nl; path=/test-app; expires=Tue, 19 Jan 2038 04:14:07 GMT; secure; samesite=Lax;'
        );
      });

      it('should redirect when new locale is different from current locale', () => {
        locationStrategy.getBaseHref.mockReturnValueOnce('/test-app/en/');
        locationStrategy.path.mockReturnValueOnce('/test-app/en/some/path');

        service.setLocale('nl');
        expect(document.location.href).toEqual('/test-app/nl/some/path');
      });

      it('should not redirect when new locale is the same as current locale', () => {
        locationStrategy.getBaseHref.mockReturnValueOnce('/test-app/en/');
        locationStrategy.path.mockReturnValueOnce('/test-app/en/some/path');

        service.setLocale('en');
        expect(document.location.href).toEqual('/test-app/en/some/path');
      });
    });
  });
});
