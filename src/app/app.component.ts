import { Component } from '@angular/core';
import { authCodeFlowConfig } from '../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { LayoutService } from '@backbase/ui-ang';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private oAuthService: OAuthService,
    public layoutService: LayoutService,
  ) {
    oAuthService.configure(authCodeFlowConfig);
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
