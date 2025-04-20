import { expect, Page, test } from '@playwright/test';
import { VisualValidator } from '../utils';
import { PageInfo } from './page-info';
import { joinUrl } from '../utils/url-utils';

export abstract class BasePage implements PageInfo {
  readonly url: string;
  readonly title: string | RegExp;
  get pageName(): string {
    return this.getPageName(this);
  }
  get visual(): VisualValidator {
    if (!this.options?.visual) {
      throw new Error(`Visual validator for ${this.pageName} is not defined`);
    }
    return this.options.visual;
  }

  locator(selector: string, options?: { hasText: string }) {
    return this.page.locator(selector, options).locator('visible=true');
  }
  byTestId(selector: string, options?: { hasText: string }) {
    return this.locator(`[data-testid="${selector}"]`, options);
  }
  pageHeader = this.locator('h1');

  constructor(
    public page: Page,
    readonly options?: Partial<{
      baseURL: string;
      url: string;
      title: string | RegExp;
      visual: VisualValidator;
    }>
  ) {
    this.url = this.options?.baseURL
      ? `${joinUrl(this.options.baseURL, this.options.url)}`
      : 'url undefined';
    this.title = this.options?.title ?? 'title undefined';
  }

  async open(param?: string | number) {
    await test.step(`Open ${this.pageName} page`, async () => {
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
