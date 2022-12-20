import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserContextGuard } from './user-context.guard';
import { UserContextService } from './user-context.service';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
})
export class UserContextComponent {
  constructor(
    private userContextService: UserContextService,
    private userContextGuard: UserContextGuard,
    private authService: OAuthService,
    private router: Router
  ) {}

  selectContextSuccess(serviceAgreement: { id: string }) {
    this.userContextService.setServiceAgreementId(serviceAgreement.id);
    this.router.navigateByUrl(this.userContextGuard.getTargetUrl() || '');
  }

  logout() {
    this.authService.revokeTokenAndLogout();
  }
}
