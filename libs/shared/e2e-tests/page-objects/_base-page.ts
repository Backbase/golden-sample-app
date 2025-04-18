import { expect, Page, test } from '@playwright/test';
import { VisualValidator } from '../utils';
import { PageInfo } from './page-info';

export abstract class BasePage implements PageInfo {
  get url(): string { return this.options?.url ?? 'url undefined'; }
  get title(): string | RegExp { return this.options?.title ?? 'title undefined'; }
  get visual(): VisualValidator {
    if (!this.options?.visual) {
      throw new Error('Visual validator is not defined');
    }
    return this.options.visual;
  }

  locator(selector: string, options?: { hasText: string }) { return this.page.locator(selector, options).locator('visible=true'); }
  byTestId(selector: string, options?: { hasText: string }) { return this.locator(`[data-testid="${selector}"]`, options); }
  pageHeader = this.locator('h1');


  constructor(
    public page: Page,
    readonly options?: Partial<{ url: string; title: string | RegExp, visual: VisualValidator }>,
  ) { }

  async open(param?: string | number) {
    await test.step(`Open ${this.getPageName(this)} page`, async () => {
      const url = param 
        ? this.url.replace(/{[^}]+}/, param.toString()) 
        : this.url;
      await this.page.goto(url);
    });
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
