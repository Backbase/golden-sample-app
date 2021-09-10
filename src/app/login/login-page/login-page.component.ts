import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppAuthService } from '../../services/app-auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  loginForm = this.formBuilder.group({
    login: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(private authService: AppAuthService, private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { login }: { login: string } = this.loginForm.value;
      this.authService.login({
        redirectUri: 'transactions',
        login: login.trim().toLowerCase(),
      });
    }
  }
}
