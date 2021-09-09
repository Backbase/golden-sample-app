import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppAuthService } from '../../services/app-auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  login = '';

  constructor(private authService: AppAuthService) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const { login }: { login: string } = loginForm.value;
      this.authService.login({
        redirectUri: 'transactions',
        login: login.trim().toLowerCase(),
      });
    }
  }
}
