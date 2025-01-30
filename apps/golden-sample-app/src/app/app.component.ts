import { Component, Inject, Optional } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { triplets } from './services/entitlementsTriplets';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  LogoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { environment } from '../environments/environment';
import {
  APP_TRANSLATIONS,
  AppTranslations,
  appTranslations,
} from './translations-catalog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  triplets = triplets;
  isAuthenticated = false;
  private readonly defaultTranslations: AppTranslations = appTranslations;
  public readonly translations: AppTranslations;

  constructor(
    private readonly oAuthService: OAuthService,
    public layoutService: LayoutService,
    @Inject(APP_TRANSLATIONS)
    private readonly overridingTranslations: AppTranslations,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.isAuthenticated =
      environment.mockEnabled ?? oAuthService.hasValidAccessToken();
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...this.overridingTranslations,
    };
  }

  logout(): void {
    this.tracker?.publish(new LogoutTrackerEvent());
    this.oAuthService.logOut(true);
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window.document.querySelector(
      '[role="main"]'
    ) as HTMLElement | undefined;
    element?.focus();
  }
}
