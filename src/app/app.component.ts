import { Component } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang';
import { AppAuthService } from './services/app-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AppAuthService, public layoutService: LayoutService) {}

  logout(): void {
    this.authService.logout();
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window?.document?.querySelector("[role='main']") as HTMLElement | undefined;
    element?.focus();
  }
}
