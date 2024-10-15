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
  journeys = [
    {
      name: $localize`:Make transfer link@@main.transfer.link.text:Make transfer`,
      route: '/transfer',
      icon: 'payments',
    },
    {
      name: $localize`:transactions list link@@main.transactions.link.text:Transactions List`,
      route: '/transactions',
      icon: 'transactions',
      permissions: triplets.canViewTransactions,
    },
    {
      name: $localize`:Ach Positive pay link@@main.ach-positive-pay.link.text:ACH Positive Pay`,
      route: '/ach-positive-pay',
      icon: 'verified-user',
      permissions: triplets.canViewAchRule,
    },
    {
      name: $localize`:Make a Payment Link@@main.make-a-payment.link.text:Make a payment`,
      route: '/transfer-internal',
      icon: 'verified-user',
    },
  ];

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
