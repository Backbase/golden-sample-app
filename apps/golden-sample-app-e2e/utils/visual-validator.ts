import { expect, Locator, Page } from '@playwright/test';
import { VisualPageTypes } from './interfaces/visual-page-types';
import { VisualTypes } from './interfaces/visual-types';

export class VisualValidator {
  rtlPrefix: string;
  constructor(
    protected page: Page,
    protected skip = false,
    protected rtl = false,
  ) {
    this.rtlPrefix = rtl ? `rtl-` : ``;
  }

  async testFullPage(name: string, options?: { waitBefore: number }) {
    if (this.skip) return;
    if (options?.waitBefore) {
      await this.page.waitForTimeout(options.waitBefore);
    }
    await expect(this.page).toHaveScreenshot(this.screenName(name), { fullPage: true, maxDiffPixelRatio: 0.01 });
  }

  async test(name: string, options?: VisualPageTypes) {
    if (this.skip) return;
    await expect(this.page).toHaveScreenshot(this.screenName(name), options);
  }

  async testWithMask(name: string, options: { mask: string[] }) {
    if (this.skip) return;
    await expect(this.page).toHaveScreenshot(this.screenName(name), {
      mask: options.mask.map((selector) => this.page.locator(selector)),
      maxDiffPixelRatio: 0.01,
    });
  }

  async testForm(name: string) {
    await this.testElement('form', name);
  }

  async testShowcase(name: string) {
    await this.testElement('bb-showcase', name);
  }

  async testElement(element: Locator | string, name: string, options?: VisualTypes) {
    if (this.skip) return;
    const locator = typeof element === 'string' ? this.page.locator(element) : element;
    await expect(locator).toHaveScreenshot(this.screenName(name), options);
  }

  async testElementWithMask(element: Locator | string, name: string, options: { mask: string[] }) {
    if (this.skip) return;
    const locator = typeof element === 'string' ? this.page.locator(element) : element;
    await expect(locator).toHaveScreenshot(this.screenName(name), {
      mask: options.mask.map((selector) => locator.locator(selector)),
      maxDiffPixelRatio: 0.01,
    });
  }

  private screenName(name) {
    return `${this.rtlPrefix}${name}.png`;
  }
}
