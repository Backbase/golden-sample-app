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
  appTranslations as defaultTranslations,
} from './translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent extends TranslationsBase<AppTranslations> {
  triplets = triplets;
  isAuthenticated = false;

  constructor(
    private readonly oAuthService: OAuthService,
    public layoutService: LayoutService,
    @Inject(APP_TRANSLATIONS)
    private readonly _translations: Partial<AppTranslations>,
    @Optional() private readonly tracker?: Tracker
  ) {
    super(defaultTranslations, _translations);
    this.isAuthenticated =
      environment.mockEnabled ?? oAuthService.hasValidAccessToken();
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
