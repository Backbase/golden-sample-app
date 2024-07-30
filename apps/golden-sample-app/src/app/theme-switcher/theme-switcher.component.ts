import { Component, Input } from '@angular/core';
import { ThemeManagerService } from './theme-service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent {
  constructor(private themeManagerService: ThemeManagerService) {}

  @Input() theme = ThemeManagerService.THEMES[0];

  themes = ThemeManagerService.THEMES;

  onSelect(theme: string | object) {
    if (typeof theme === 'string') {
      this.themeManagerService.setTheme(theme);
      this.theme = theme;
    }
  }
}
