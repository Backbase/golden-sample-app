import { Component, inject, Inject, OnInit } from '@angular/core';
import { localesCatalog } from './locales-catalog';
import { LOCALES_LIST, LocalesService } from '@backbase/shared/util/app-core';
import { CommonModule } from '@angular/common';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';

type Locale = (typeof localesCatalog)[string];

@Component({
  selector: 'app-locale-selector',
  templateUrl: 'locale-selector.component.html',
  imports: [DropdownMenuModule, CommonModule],
})
export class LocaleSelectorComponent implements OnInit {
  localesCatalog: Locale[] = [];
  private currentLanguage: Locale | undefined;

  private readonly localeService: LocalesService = inject(LocalesService);
  private readonly locales: string[] = inject(LOCALES_LIST);

  set language(value: string | object | Locale | undefined) {
    if (typeof value === 'string') {
      return;
    }

    this.localeService.setLocale((value as Locale).code);
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
