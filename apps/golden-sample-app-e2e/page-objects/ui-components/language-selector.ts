import { expect } from '@playwright/test';
import { PageComponent } from './_page-component';

// TODO Remove or update while using on project
export class LanguageSelector extends PageComponent {
  toggle = this.$('#kc-current-locale-link');
  languages = (language: string) => this.$('.dropdown-item', { hasText: language });

  async openSelector() {
    await expect(this.toggle).toBeVisible();
    await this.toggle.click();
  }

  async selectLanguage(language: string) {
    await this.openSelector();
    await this.languages(language).click();
  }
}
