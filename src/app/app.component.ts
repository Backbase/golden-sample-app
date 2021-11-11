import { Component, Inject, OnInit } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { triplets } from './services/entitlementsTriplets';
import { OAuthService } from 'angular-oauth2-oidc';
import { PageConfig, PAGE_CONFIG, SetLocale, SET_LOCALE } from '@backbase/foundation-ang/web-sdk';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
  triplets = triplets;
  isAuthenticated = false;
  _language: string = '';

  set language(value :string) {
    this.setLocaleService(value).then((value) => {
      this.document.location.replace('http://localhost:4200');
    });
    this._language = value;
  }

  get language() {
    return this._language;
  }

  constructor(
    private oAuthService: OAuthService, 
    @Inject(SET_LOCALE) private setLocaleService: SetLocale,
    @Inject(PAGE_CONFIG) private pageConfigService: PageConfig,
    @Inject(DOCUMENT) private document: Document,
    public layoutService: LayoutService
  ) {
    this.isAuthenticated = oAuthService.hasValidAccessToken();
  }

  logout(): void {
    this.oAuthService.logOut(true);
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window?.document?.querySelector('[role=\'main\']') as HTMLElement | undefined;
    element?.focus();
  }

  ngOnInit() {
    this._language = this.pageConfigService.locale;
  }
}
