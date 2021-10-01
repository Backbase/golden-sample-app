import { Component } from '@angular/core';
import { OAuthService } from "angular-oauth2-oidc";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  constructor(private oAuthService: OAuthService) {}

  login(): void {
    this.oAuthService.initLoginFlow();
  }
}
