import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  SharedUserContextGuard,
  SharedUserContextService,
} from '@backbase-gsa/shared/feature/user-context';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
  standalone: false,
})
export class UserContextComponent {
  constructor(
    private userContextService: SharedUserContextService,
    private userContextGuard: SharedUserContextGuard,
    private authService: OAuthService,
    private router: Router
  ) {}

  selectContextSuccess(serviceAgreement: { id: string }) {
    this.userContextService.setServiceAgreementId(serviceAgreement.id);
    this.router.navigateByUrl(this.userContextGuard.getTargetUrl() || '');
  }

  logout() {
    this.authService.logOut();
  }
}
