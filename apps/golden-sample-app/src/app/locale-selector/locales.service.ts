import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, LOCALE_ID } from '@angular/core';
export const LOCALES_LIST = new InjectionToken<Array<string>>(
  'List of locales available'
);

@Injectable()
export class LocalesService {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(DOCUMENT) private document: Document
  ) {}
  setLocaleCookie(value: string) {
    this.document.cookie =
      encodeURIComponent('bb-locale') + '=' + encodeURIComponent(value) + ';';
  }

  get currentLocale() {
    return this.locale;
  }
}
