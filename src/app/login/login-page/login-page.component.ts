import { Component } from '@angular/core';
import { AppAuthService } from '../../services/app-auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  constructor(private authService: AppAuthService) {}

  login(): void {
    this.authService.login();
  }
}
