import { Component, inject, Input } from '@angular/core';
import { ThemeManagerService } from './theme-service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  standalone: false,
})
export class ThemeSwitcherComponent {
  private readonly themeManagerService: ThemeManagerService =
    inject(ThemeManagerService);

  @Input() theme = ThemeManagerService.THEMES[0];

  protected themes = ThemeManagerService.THEMES;

  protected onSelect(theme: string | object) {
    if (typeof theme === 'string') {
      this.themeManagerService.setTheme(theme);
      this.theme = theme;
    }
  }
}
