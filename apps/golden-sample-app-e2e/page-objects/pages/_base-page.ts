import { expect, Locator, Page, test, TestInfo } from '@playwright/test';
import { LocatorOptions } from '../../utils/locator-options';

export abstract class BasePage {
  url: string;
  title: string | RegExp;

  constructor(
    public page: Page,
    public testInfo: TestInfo,
    options?: Partial<{ url: string; title: string | RegExp }>,
  ) {
    this.url = options?.url || '';
    this.title = options?.title || '';
  }

  async open() {
    await test.step(`Open ${this.getPageName(this)} page`, async () => {
      await this.page.goto(this.url);
    });
  }

  $(selector: string, options?: LocatorOptions): Locator {
    return this.page.locator(selector, options);
  }

  async toBeOpened() {
    if (this.url) {
      await expect(this.page).toHaveURL(this.url);
    }
    if (this.title) {
      await expect(this.page).toHaveTitle(this.title);
    }
  }

  protected getPageName(page: object): string {
    const pageName = page.constructor.name;
    return pageName.toLowerCase().endsWith('page')
      ? pageName.substring(0, pageName.length - 4)
      : pageName;
  }
}
