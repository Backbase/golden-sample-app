import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  public static THEMES = [
    'theme-default',
    'theme-premium',
  ];

  public static setTheme(theme: any):void {
    const linkElement: HTMLLinkElement | null = window.document.head.querySelector('link[rel="stylesheet"]');
    if (!linkElement) return;
    linkElement.href = `${theme}.css`;
  }
}
