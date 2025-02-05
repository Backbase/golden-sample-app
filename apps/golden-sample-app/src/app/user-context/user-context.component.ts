import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserContextGuard } from './user-context.guard';
import { UserContextService } from './user-context.service';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
  standalone: false,
})
export class UserContextComponent {
  constructor(
    private readonly userContextService: UserContextService,
    private readonly userContextGuard: UserContextGuard,
    private readonly authService: OAuthService,
    private readonly router: Router
  ) {}

  selectContextSuccess(serviceAgreement: { id: string }) {
    this.userContextService.setServiceAgreementId(serviceAgreement.id);
    this.router.navigateByUrl(this.userContextGuard.getTargetUrl() || '');
  }

  logout() {
    this.authService.logOut();
  }
}
