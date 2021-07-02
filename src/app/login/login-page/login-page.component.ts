import { Component, OnInit } from '@angular/core';
// import { AuthService } from '@backbase/foundation-ang/web-sdk';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass'],
})
export class LoginPageComponent implements OnInit {
  constructor() {} // private readonly auth: AuthService,

  ngOnInit(): void {}

  login(): void {
    console.log('login');
    // this.auth.goToLoginPage(window.location.origin + '/user');
  }
}
