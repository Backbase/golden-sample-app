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
      return;
    }
    
    if (value && 'code' in value) {
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

    const currentLocale = this.localeService.currentLocale;
    this.currentLanguage = this.findLocale(currentLocale);
    
    // If current language wasn't found in the catalog, default to the first available
    if (!this.currentLanguage && this.localesCatalog.length > 0) {
      this.currentLanguage = this.localesCatalog[0];
    }
  }

  private findLocale(locale: string): Locale | undefined {
    if (this.locales.includes(locale)) {
      return localesCatalog[locale];
    }

    return undefined;
  }
}
