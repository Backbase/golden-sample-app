import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserContextGuard } from './user-context.guard';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
})
export class UserContextComponent {
  private readonly redirectUrl: string;

  constructor(
    private userContextGuard: UserContextGuard,
    private authService: OAuthService,
    private router: Router
  ) {
    this.redirectUrl = this.userContextGuard.getTargetUrl() ?? '/';
  }

  redirect() {
    this.router.navigateByUrl(this.redirectUrl);
  }

  logout() {
    this.authService.revokeTokenAndLogout();
    this.authService.initLoginFlow();
  }
}
