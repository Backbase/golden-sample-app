import { Component, OnInit } from '@angular/core';
import { AuthService } from '@backbase/foundation-ang/auth';
import { OAuthService } from 'angular-oauth2-oidc';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {
  constructor(
    private readonly oAuthService: OAuthService,
  ) { }

  ngOnInit(): void {}

  login(): void {
    this.oAuthService.initLoginFlow();
  }
}
