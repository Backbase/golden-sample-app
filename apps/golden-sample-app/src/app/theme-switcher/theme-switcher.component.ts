import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ThemeService } from "./theme-service";

@Component({
selector: 'app-theme-switcher',
templateUrl: './theme-switcher.component.html',
})
export class ThemeExporterComponent{
  @Input()
  theme = ThemeService.THEMES[0];

  @Output()
  setTheme = new EventEmitter<string>();

  themes = ThemeService.THEMES;

  onSelect(theme: string) {
    console.log(theme);
    //this.setTheme.emit(theme);
  }
}
