import { Component, Optional } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  LogoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isAuthenticated = false;

  constructor(
    private oAuthService: OAuthService,
    public layoutService: LayoutService,
    @Optional() private readonly tracker?: Tracker
  ) {
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
