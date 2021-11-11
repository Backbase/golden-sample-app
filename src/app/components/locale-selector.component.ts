import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { PAGE_CONFIG, SetLocale, SET_LOCALE } from "@backbase/foundation-ang/web-sdk";
import { PageConfigCx, localesCatalog } from "../../model/Page";

@Component({
  selector: 'bb-locale-selector',
  templateUrl: 'locale-selector.component.html',
})
export class LocaleSelectorComponent implements OnInit {
  private _language: string = '';
  localesCatalog = localesCatalog;
  locales = this.pageConfigService.locales;

  set language(value :string) {
    this.setLocaleService(value).then((value) => {
      this.document.location.href = '/';
    });
    this._language = value;
  }

  get language() {
    return this._language;
  }

  ngOnInit() {
    this._language = this.pageConfigService.locale;
  }

  constructor(
    @Inject(SET_LOCALE) private setLocaleService: SetLocale,
    @Inject(PAGE_CONFIG) private pageConfigService: PageConfigCx,
    @Inject(DOCUMENT) private document: Document,
  ){}
}