import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  public static THEMES = ['theme-default', 'theme-premium'];

  setTheme(theme: string) {
    const linkElement: HTMLLinkElement | null =
      window.document.head.querySelector('link[rel="stylesheet"]');
    if (!linkElement) return;
    linkElement.href = `${theme}.css`;
  }
}
