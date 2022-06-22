import { DOCUMENT } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { LOCALES_LIST, LocalesService } from './locales.service';
import { localesCatalog } from './locales-catalog';

export const documentWrapper = new InjectionToken<Document>(
  'wrapper for document service'
);

@Component({
  selector: 'app-locale-selector',
  templateUrl: 'locale-selector.component.html',
  providers: [
    {
      provide: documentWrapper,
      useExisting: DOCUMENT,
    },
  ],
})
export class LocaleSelectorComponent implements OnInit {
  localesCatalog = localesCatalog;
  private currentLanguage = '';

  constructor(
    private localeService: LocalesService,
    @Inject(LOCALES_LIST) public locales: Array<string>,
    @Inject(documentWrapper) private document: Document
  ) {
    const event = new CustomEvent('data-analytics-languages-available', { detail: { locales } });
    window.dispatchEvent(event);
  }

  set language(value: string) {
    const event = new CustomEvent('data-analytics-change-language', { detail: { locale: value } });
    window.dispatchEvent(event);
    this.localeService.setLocaleCookie(value);
    this.document.location.href = this.document.location.origin;
  }

  get language() {
    return this.currentLanguage;
  }

  ngOnInit() {
    this.currentLanguage = this.findLocale(this.localeService.currentLocale);
    const event = new CustomEvent('data-analytics-change-language', { detail: { locale: this.currentLanguage } });
    window.dispatchEvent(event);
  }

  private findLocale(locale: string): string {
    if (this.locales.includes(locale)) {
      return locale;
    }

    return '';
  }
}
