import { Component, Input } from '@angular/core';
import { ThemeManagerService } from './theme-service';
import { DropdownMenuModule } from '@backbase/ui-ang/dropdown-menu';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  standalone: true,
  imports: [DropdownMenuModule],
})
export class ThemeSwitcherComponent {
  constructor(private themeManagerService: ThemeManagerService) {}

  @Input() theme = ThemeManagerService.THEMES[0];

  protected themes = ThemeManagerService.THEMES;

  protected onSelect(theme: string | object) {
    if (typeof theme === 'string') {
      this.themeManagerService.setTheme(theme);
      this.theme = theme;
    }
  }
}
