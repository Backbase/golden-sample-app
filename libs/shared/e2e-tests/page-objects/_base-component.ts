import { Locator, Page, test, TestInfo } from '@playwright/test';
import { BasePage } from './_base-page';
import { VisualValidator, isLocator, expect } from '../utils';
import { PageInfo } from './page-info';

export abstract class BaseComponent implements PageInfo {
  readonly page: Page;
  readonly rootLocator: Locator | undefined;
  get elementLocator(): string {
    const locatorString = this.element.toString();
    return locatorString.replace(/^locator\(['"](.*)['"]\).*$/, '$1');
  }
  get element(): Locator {
    if (!this.rootLocator) {
      throw new Error('Root element is Page not a Locator');
    }
    return this.rootLocator;
  }
  get visual(): VisualValidator {
    if (!this.options?.visual) {
      throw new Error('Visual validator is not defined');
    }
    return this.options.visual;
  }
  get testInfo(): TestInfo {
    if (!this.options?.testInfo) {
      throw new Error('TestInfo is not defined');
    }
    return this.options.testInfo;
  }
  locator(selector: string, options?: { hasText: string }) {
    return this.page.locator(selector, options).locator('visible=true');
  }
  child(selector: string, options?: { hasText: string }) {
    return this.element.locator(selector, options).locator('visible=true');
  }
  byTestId(selector: string, options?: { hasText: string }) {
    return this.locator(`[data-testid="${selector}"]`, options);
  }
  childByTestId(selector: string, options?: { hasText: string }) {
    return this.child(`[data-testid="${selector}"]`, options);
  }

  constructor(
    rootElement: Locator | Page | PageInfo,
    readonly options?: PageInfo
  ) {
    if (isLocator(rootElement)) {
      this.page = rootElement.page();
      this.rootLocator = rootElement;
      return;
    }
    if (Object.keys(rootElement).includes('page')) {
      const pageInfo = rootElement as BasePage;
      this.page = pageInfo.page;
      return;
    }
    this.page = rootElement as Page;
  }

  async toBeAccessible(options?: { disableRules?: string[] }) {
    await test.step(`Validate ${this.elementLocator} accessibility`, async () => {
      const { page, testInfo } = this;
      const { disableRules } = options || {};
      if (!testInfo) {
        throw new Error('TestInfo is required for accessibility testing');
      }
      await expect({ page, testInfo }).toBeAccessible({
        include: this.elementLocator,
        disableRules,
      });
    });
  }

  async toHaveData<T>(
    data: { actual: () => Promise<T>; expected: T | (() => T) },
    options?: { stepName?: string; timeout?: number }
  ) {
    const stepTitle =
      options?.stepName || `Validate data: ${JSON.stringify(data.expected)}`;
    const timeout = options?.timeout || 5_000;
    const expectedData: T =
      typeof data.expected === 'function'
        ? (data.expected as () => T)()
        : data.expected;
    await this.visual.step(stepTitle, async () => {
      await expect(async () => {
        const actualData: T = await data.actual();
        expect(actualData as object, { message: stepTitle }).toEqual(
          expectedData
        );
      }).toPass({ timeout });
    });
  }
}
