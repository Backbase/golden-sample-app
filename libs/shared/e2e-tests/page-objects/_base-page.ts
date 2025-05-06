import { Page, test, TestInfo } from '@playwright/test';
import { VisualValidator, joinUrl, expect } from '../utils';
import { PageInfo } from './page-info';

export abstract class BasePage implements PageInfo {
  readonly url: string;
  readonly title: string | RegExp;
  get testInfo(): TestInfo {
    if (!this.options?.testInfo) {
      throw new Error(`testInfo for ${this.pageName} is not defined`);
    }
    return this.options.testInfo;
  }
  get pageName(): string {
    return this.getPageName(this);
  }
  get visual(): VisualValidator {
    if (!this.options?.visual) {
      throw new Error(`visual for ${this.pageName} is not defined`);
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
    readonly options: {
      baseURL?: string;
      url?: string;
      title?: string | RegExp;
      visual?: VisualValidator;
      testInfo?: TestInfo;
    }
  ) {
    this.url = this.options?.baseURL
      ? `${joinUrl(this.options.baseURL, this.options.url)}`
      : 'url undefined';
    this.title = this.options?.title ?? 'title undefined';
  }

  async open(param?: string | number) {
    const url = param
      ? this.url.replace(/{[^}]+}/, param.toString())
      : this.url;
    await test.step(`Open ${this.pageName} page (${url})`, async () => {
      await this.page.goto(url);
      await this.page.waitForLoadState('networkidle');
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

  async toBeAccessible(options?: { disableRules?: string[] }) {
    await test.step(`Validate ${this.pageName} page accessibility`, async () => {
      const { page, testInfo } = this;
      await expect({ page, testInfo }).toBeAccessible(options);
    });
  }

  protected getPageName(page: object): string {
    const pageName = page.constructor.name;
    return pageName.toLowerCase().endsWith('page')
      ? pageName.substring(0, pageName.length - 4)
      : pageName;
  }
}
