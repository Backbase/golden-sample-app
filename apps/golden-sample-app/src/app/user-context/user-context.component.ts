import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  SharedUserContextGuard,
  SharedUserContextService,
  SHARED_USER_CONTEXT_PROVIDERS,
} from '@backbase/shared/feature/user-context';
import { SelectContextModule } from '@backbase/select-context';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
  imports: [CommonModule, SelectContextModule],
  providers: [...SHARED_USER_CONTEXT_PROVIDERS],
})
export default class UserContextComponent {
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
