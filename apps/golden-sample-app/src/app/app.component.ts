import { Component, Optional } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  LogoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { environment } from '../environments/environment';
import { EnvironmentService, triplets } from '@backbase-gsa/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  triplets = triplets;
  isAuthenticated = false;

  constructor(
    private oAuthService: OAuthService,
    private envService: EnvironmentService,
    public layoutService: LayoutService,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.isAuthenticated =
      environment.mockEnabled ?? oAuthService.hasValidAccessToken();
    this.envService.initializeEnvironment(environment);
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
