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
export class AppComponent {
  triplets = triplets;
  isAuthenticated = false;
  

  constructor(
    private oAuthService: OAuthService,
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
}
