import { Component } from '@angular/core';
import { authConfig } from '../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { LayoutService } from '@backbase/ui-ang';
import { TRIPLETS } from './services/entitlementsTriplets';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  TRIPLETS = TRIPLETS;
  constructor(
    private oAuthService: OAuthService,
    public layoutService: LayoutService,
  ) {
    oAuthService.configure(authConfig);
    oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  logout(): void {
    this.oAuthService.logOut();
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window?.document?.querySelector('[role=\'main\']') as HTMLElement | undefined;
    element?.focus();
  }
}
