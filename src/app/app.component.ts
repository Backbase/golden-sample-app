import { Component } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang';
import { map } from 'rxjs/operators';
import { AppAuthService } from './services/app-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AppAuthService, public layoutService: LayoutService) {}

  public isAuthenticated$ = this.authService.isAuthenticated$;
  public currentUserName$ = this.authService.currentUser$.pipe(map((user) => user?.name));

  logout(): void {
    this.authService.logout();
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window?.document?.querySelector("[role='main']") as HTMLElement | undefined;
    element?.focus();
  }
}
