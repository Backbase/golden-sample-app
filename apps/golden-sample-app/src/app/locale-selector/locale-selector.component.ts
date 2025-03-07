import { Component, Inject, OnInit } from '@angular/core';
import { LOCALES_LIST, LocalesService } from './locales.service';
import { localesCatalog } from './locales-catalog';

type Locale = (typeof localesCatalog)[string];

@Component({
  selector: 'app-locale-selector',
  templateUrl: 'locale-selector.component.html',
})
export class LocaleSelectorComponent implements OnInit {
  localesCatalog: Locale[] = [];
  private currentLanguage: Locale | undefined;

  constructor(
    private localeService: LocalesService,
    @Inject(LOCALES_LIST) public locales: string[]
  ) {}

  set language(value: string | object | Locale | undefined) {
    if (typeof value === 'string') {
      // If we receive a string locale code directly
      const locale = this.findLocale(value);
      if (locale) {
        this.currentLanguage = locale;
        this.localeService.setLocale(value);
      }
      return;
    }
    
    if (value && typeof value === 'object' && 'code' in value) {
      this.currentLanguage = value as Locale;
      this.localeService.setLocale((value as Locale).code);
    }
  }

  get language(): Locale | undefined {
    return this.currentLanguage;
  }

  ngOnInit() {
    this.localesCatalog = this.locales.reduce(
      (acc: Locale[], locale) => [...acc, localesCatalog[locale]],
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
