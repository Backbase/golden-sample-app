import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  public static THEMES = [
    'theme-v2',
    'theme-alien-global',
    'theme-alien-local',
    'theme-all-red',
    'theme-dark',
    'theme-premium',
    'theme-purple',
  ];

  private _currentTheme = 'theme-v2';

  get currentTheme() {
    return this._currentTheme;
  }

  setTheme(theme: string): void {
    this.setThemeStyle(theme);
  }

  private setThemeStyle(theme: string) {
    const styleLinkElement = this.getStyleLinkElement();

    if (styleLinkElement) {
      this.setStyleLinkElementHref(styleLinkElement, theme);
      this._currentTheme = theme;
    }
  }

  private getStyleLinkElement() {
    const linkElement: any = window.document.head.querySelector('link[rel="stylesheet"]');

    return linkElement;
  }

  private setStyleLinkElementHref(linkElement: HTMLLinkElement, theme: string) {
    linkElement.href = theme + '.css';
  }
}
