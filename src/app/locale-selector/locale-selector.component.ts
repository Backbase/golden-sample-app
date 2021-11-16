import { DOCUMENT } from "@angular/common";
import { Component, Inject, InjectionToken, OnInit } from "@angular/core";
import { LocalesService, LOCALES_LIST } from "./locales.service";
import { localesCatalog } from "./locales-catalog";

export const DocumentWrapper = new InjectionToken<Document>('wrapper for document service');

@Component({
  selector: 'bb-locale-selector',
  templateUrl: 'locale-selector.component.html',
  providers: [{
    provide: DocumentWrapper,
    useExisting: DOCUMENT,
  }]
})
export class LocaleSelectorComponent implements OnInit {
  private _language: string = '';
  localesCatalog = localesCatalog;

  set language(value: string) {
    this.localeService.setLocaleCookie(value);
    this.document.location.href = this.document.location.origin;
  }

  get language() {
    return this._language;
  }

  private findLocale(locale: string): string {
    if (this.locales.includes(locale)) {
      return locale;
    }

    return '';
  }

  ngOnInit() {
    this._language = this.findLocale(this.localeService.currentLocale);
  }

  constructor(
    private localeService: LocalesService,
    @Inject(LOCALES_LIST) public locales: Array<string>,
    @Inject(DocumentWrapper) private document: Document,
  ){}
}
