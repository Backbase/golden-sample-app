import { expect, test, Locator, Page } from '@playwright/test';
import { VisualPageTypes } from '../interfaces/visual-page-types';
import { VisualTypes } from '../interfaces/visual-types';
import { attachment, ContentType } from 'allure-js-commons';
import { rtlScreenName, stepNameToKebabCase } from '../string-utils';

export class VisualValidator {
  get rtlPrefix() {
    return this.options?.rtl ? `rtl-` : ``;
  }
  get skip() {
    return this.options?.skip ?? false;
  }
  get makeStepScreen() {
    return this.options?.makeStepScreen ?? true;
  }

  constructor(
    protected page: Page,
    readonly options?: {
      skip: boolean;
      rtl: boolean;
      makeStepScreen: boolean;
    }
  ) {}

  async testFullPage(name: string, options?: { waitBefore: number }) {
    if (this.skip) return;
    if (options?.waitBefore) {
      await this.page.waitForTimeout(options.waitBefore);
    }
    await expect(this.page).toHaveScreenshot(this.screenName(name), {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
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

  async testElement(
    element: Locator | string,
    name: string,
    options?: VisualTypes
  ) {
    if (this.skip) return;
    const locator =
      typeof element === 'string' ? this.page.locator(element) : element;
    await expect(locator).toHaveScreenshot(this.screenName(name), options);
  }

  async testElementWithMask(
    element: Locator | string,
    name: string,
    options: { mask: string[] }
  ) {
    if (this.skip) return;
    const locator =
      typeof element === 'string' ? this.page.locator(element) : element;
    await expect(locator).toHaveScreenshot(this.screenName(name), {
      mask: options.mask.map((selector) => locator.locator(selector)),
      maxDiffPixelRatio: 0.01,
    });
  }

  private screenName(name: string) {
    return `${this.rtlPrefix}${name}.png`;
  }

  async step<T>(
    title: string,
    body?: () => T | Promise<T>,
    screenName: string | false = ''
  ) {
    const makeScreen = screenName && this.makeStepScreen;
    await test.step((makeScreen ? '[Screen] ' : '') + title, async () => {
      if (body) {
        await body();
      }
      if (!makeScreen) return;
      await attachment(
        rtlScreenName(
          stepNameToKebabCase(`${title}` + (screenName ? ` ${screenName}` : ''))
        ),
        await this.page.screenshot({ fullPage: true }),
        {
          contentType: ContentType.PNG,
        }
      );
    });
  }
}
