import { Component } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang';
import { AppAuthService } from './services/app-auth.service';
import { triplets } from './services/entitlementsTriplets';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  triplets = triplets;
  public isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AppAuthService, public layoutService: LayoutService) {
    /**
     * This call of initial set up is valid only for golder-sample-application,
     * because of the `angular-oauth2-oidc` library inner structure
     */
    this.authService.runInitialLoginSequence();
  }

  logout(): void {
    this.authService.logout();
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window?.document?.querySelector('[role=\'main\']') as HTMLElement | undefined;
    element?.focus();
  }
}
