import { Component } from '@angular/core';
import { authCodeFlowConfig } from '../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'golden-sample-app';

  constructor(oAuthService: OAuthService) {
    oAuthService.configure(authCodeFlowConfig);
    oAuthService.loadDiscoveryDocumentAndTryLogin();
  }


}
