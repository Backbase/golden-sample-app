import { TestBed } from '@angular/core/testing';
import { LocationStrategy, DOCUMENT } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { LocalesService } from './locales.service';

describe('LocalesService', () => {
  let service: LocalesService;
  let mockLocationStrategy: jest.Mocked<
    Pick<LocationStrategy, 'getBaseHref' | 'path'>
  >;
  let mockDocument: any;

  const mockLocale = 'en';

  beforeEach(() => {
    mockLocationStrategy = {
      getBaseHref: jest.fn(() => '/'),
      path: jest.fn(() => '/'),
    };

    mockDocument = {
      cookie: '',
      location: {
        href: '',
      },
    };

    TestBed.configureTestingModule({
      providers: [
        LocalesService,
        { provide: LocationStrategy, useValue: mockLocationStrategy },
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: LOCALE_ID, useValue: mockLocale },
      ],
    });
    service = TestBed.inject(LocalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current locale', () => {
    expect(service.currentLocale).toBe(mockLocale);
  });

  describe('setLocale', () => {
    describe('when application root is empty (/)', () => {
      it('should set locale cookie', () => {
        mockLocationStrategy.getBaseHref.mockReturnValueOnce('/en/');
        mockLocationStrategy.path.mockReturnValueOnce('/en/some/path');

        service.setLocale('nl');
        expect(mockDocument.cookie).toEqual(
          'bb-locale=nl; path=/; expires=Tue, 19 Jan 2038 04:14:07 GMT; secure; samesite=Lax;'
        );
      });

      it('should redirect when new locale is different from current locale', () => {
        mockLocationStrategy.getBaseHref.mockReturnValueOnce('/en/');
        mockLocationStrategy.path.mockReturnValueOnce('/en/some/path');

        service.setLocale('nl');
        expect(mockDocument.location.href).toEqual('/nl/some/path');
      });

      it('should not redirect when new locale is the same as current locale', () => {
        mockLocationStrategy.getBaseHref.mockReturnValueOnce('/en/');
        mockLocationStrategy.path.mockReturnValueOnce('/en/some/path');
        mockDocument.location.href = '/en/some/path';

        service.setLocale('en');
        expect(mockDocument.location.href).toEqual('/en/some/path');
      });
    });

    describe('when application root is not empty (/test-app/)', () => {
      it('should set locale cookie', () => {
        mockLocationStrategy.getBaseHref.mockReturnValueOnce('/test-app/en/');
        mockLocationStrategy.path.mockReturnValueOnce('/test-app/en/some/path');

        service.setLocale('nl');
        expect(mockDocument.cookie).toEqual(
          'bb-locale=nl; path=/test-app; expires=Tue, 19 Jan 2038 04:14:07 GMT; secure; samesite=Lax;'
        );
      });

      it('should redirect when new locale is different from current locale', () => {
        mockLocationStrategy.getBaseHref.mockReturnValueOnce('/test-app/en/');
        mockLocationStrategy.path.mockReturnValueOnce('/test-app/en/some/path');

        service.setLocale('nl');
        expect(mockDocument.location.href).toEqual('/test-app/nl/some/path');
      });

      it('should not redirect when new locale is the same as current locale', () => {
        mockLocationStrategy.getBaseHref.mockReturnValueOnce('/test-app/en/');
        mockLocationStrategy.path.mockReturnValueOnce('/test-app/en/some/path');

        service.setLocale('en');
        expect(mockDocument.location.href).toEqual('');
      });
    });
  });
});
