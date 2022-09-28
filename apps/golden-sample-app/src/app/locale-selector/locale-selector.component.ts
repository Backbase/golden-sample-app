import { DOCUMENT } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { LOCALES_LIST, LocalesService } from './locales.service';
import { localesCatalog } from './locales-catalog';

type Locale = typeof localesCatalog[string];

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
  localesCatalog: Array<Locale> = [];
  private currentLanguage: Locale | undefined;

  constructor(
    private localeService: LocalesService,
    @Inject(LOCALES_LIST) public locales: Array<string>,
    @Inject(documentWrapper) private document: Document
  ) {}

  set language(value: string | object | Locale | undefined) {
    if (typeof value === 'string') {
      return;
    }

    this.localeService.setLocaleCookie((value as Locale).code);
    this.document.location.href = this.document.baseURI;
  }

  get language(): Locale | undefined {
    return this.currentLanguage;
  }

  ngOnInit() {
    this.localesCatalog = this.locales.reduce(
      (acc: Array<Locale>, locale) => [...acc, localesCatalog[locale]],
      []
    );

    this.currentLanguage = this.findLocale(this.localeService.currentLocale);
  }

  private findLocale(locale: string): Locale | undefined {
    if (this.locales.includes(locale)) {
      return localesCatalog[locale];
    }

    return undefined;
  }
}
