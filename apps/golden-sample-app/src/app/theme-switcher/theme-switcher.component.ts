import { Component, Input } from "@angular/core";
import { ThemeService } from "./theme-service";

@Component({
selector: 'app-theme-switcher',
templateUrl: './theme-switcher.component.html',
})
export class ThemeExporterComponent{
  @Input()
  theme = ThemeService.THEMES[0];

  themes = ThemeService.THEMES;

  onSelect(theme: any) {
    ThemeService.setTheme(theme);
    this.theme = theme;
  }
}
