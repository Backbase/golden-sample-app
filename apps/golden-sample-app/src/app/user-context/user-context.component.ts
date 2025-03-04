import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserContextGuard } from './user-context.guard';
import { UserContextService } from './user-context.service';
import { SelectContextModule } from '@backbase/select-context';

@Component({
  selector: 'app-user-context',
  templateUrl: './user-context.component.html',
  standalone: true,
  imports: [SelectContextModule],
})
export class UserContextComponent {
  constructor(
    private readonly router: Router,
    private readonly userContextGuard: UserContextGuard,
    private readonly userContextService: UserContextService,
    private readonly oAuthService: OAuthService
  ) {}

  selectContextSuccess(serviceAgreement: { id: string }) {
    this.userContextService.setServiceAgreementId(serviceAgreement.id);
    const targetUrl = this.userContextGuard.getTargetUrl() || '';
    this.router.navigate([targetUrl]);
  }

  logout() {
    this.oAuthService.logOut();
  }
}
