import { Component } from '@angular/core';
import { authCodeFlowConfig } from '../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { LayoutService } from '@backbase/ui-ang';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'golden-sample-app';

  constructor(
    private oAuthService: OAuthService,
    private router: Router,
    public layoutService: LayoutService,
  ) {
    oAuthService.configure(authCodeFlowConfig);
    oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  logout(): void {
    this.oAuthService.revokeTokenAndLogout().then(() => this.router.navigate(['login']));
  }
}
