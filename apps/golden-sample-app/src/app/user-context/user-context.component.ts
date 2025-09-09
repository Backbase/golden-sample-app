import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  SharedUserContextGuard,
  SharedUserContextService,
} from '@backbase/shared/feature/user-context';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
  standalone: false,
})
export class UserContextComponent {
  private readonly userContextService: SharedUserContextService = inject(
    SharedUserContextService
  );
  private readonly userContextGuard: SharedUserContextGuard = inject(
    SharedUserContextGuard
  );
  private readonly authService: OAuthService = inject(OAuthService);
  private readonly router: Router = inject(Router);

  selectContextSuccess(serviceAgreement: { id: string }) {
    this.userContextService.setServiceAgreementId(serviceAgreement.id);
    this.router.navigateByUrl(this.userContextGuard.getTargetUrl() || '');
  }

  logout() {
    this.authService.logOut();
  }
}
