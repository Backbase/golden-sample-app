import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  LogoutTrackerEvent,
  Tracker,
} from '@backbase/foundation-ang/observability';
import { ActivityMonitorModule } from '@backbase/shared/feature/auth';
import { IconModule } from '@backbase/ui-ang/icon';
import { LayoutService } from '@backbase/ui-ang/layout';
import { LogoModule } from '@backbase/ui-ang/logo';
import { OAuthService } from 'angular-oauth2-oidc';
import { LocaleSelectorComponent } from './locale-selector/locale-selector.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    ActivityMonitorModule,
    CommonModule,
    LogoModule,
    NavigationMenuComponent,
    ThemeSwitcherComponent,
    LocaleSelectorComponent,
    IconModule,
    RouterOutlet,
  ],
})
export class AppComponent {
  private readonly oAuthService: OAuthService = inject(OAuthService);
  readonly layoutService: LayoutService = inject(LayoutService);
  private readonly tracker: Tracker | null = inject(Tracker, {
    optional: true,
  });

  logout(): void {
    this.tracker?.publish(new LogoutTrackerEvent());
    this.oAuthService.logOut(true);
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window.document.querySelector(
      '[role="main"]'
    ) as HTMLElement | undefined;
    element?.focus();
  }
}
