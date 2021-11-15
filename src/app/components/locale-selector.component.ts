import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { localesCatalog } from "../../model/Page";
import { LocalesService, LOCALES_LIST } from "../services/locales.service";

@Component({
  selector: 'bb-locale-selector',
  templateUrl: 'locale-selector.component.html',
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
    @Inject(DOCUMENT) private document: Document,
  ){}
}
