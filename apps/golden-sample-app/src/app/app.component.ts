import { Component, OnInit, Optional } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { triplets } from './services/entitlementsTriplets';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  LogoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { environment } from '../environments/environment';
import { instrumentOpentelemetry } from '../assets/scripts/instrument';
import packageInfo from 'package-json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  triplets = triplets;
  isAuthenticated = false;

  constructor(
    private oAuthService: OAuthService,
    public layoutService: LayoutService,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.isAuthenticated =
      environment.mockEnabled ?? oAuthService.hasValidAccessToken();
  }

  ngOnInit(): void {
    instrumentOpentelemetry({
      appName: packageInfo.name,
      appVersion: packageInfo.version,
      apiKey: environment.bbApiKey as string,
      env: 'local',
      isProduction: false,
      isTracerEnabled: true,
      url: environment.otelURL as string,
    });
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
