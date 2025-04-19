import { Locator, Page } from '@playwright/test';
import { isLocator } from '../../../shared/e2e-tests/utils/playwright-utils';
import { BasePage } from './_base-page';
import { VisualValidator } from '../utils';
import { PageInfo } from './page-info';

export abstract class BaseComponent implements PageInfo {
  readonly page: Page;
  readonly rootLocator: Locator | undefined;
  get root(): Locator {
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
  locator(selector: string, options?: { hasText: string }) {
    return this.page.locator(selector, options).locator('visible=true');
  }
  child(selector: string, options?: { hasText: string }) {
    return this.root.locator(selector, options).locator('visible=true');
  }
  byTestId(selector: string, options?: { hasText: string }) {
    return this.locator(`[data-testid="${selector}"]`, options);
  }
  childByTestId(selector: string, options?: { hasText: string }) {
    return this.child(`[data-testid="${selector}"]`, options);
  }

  constructor(
    rootElement: Locator | Page | PageInfo,
    readonly options?: { visual: VisualValidator }
  ) {
    if (isLocator(rootElement)) {
      this.page = rootElement.page();
      this.rootLocator = rootElement;
      return;
    }
    if (Object.keys(rootElement).includes('page')) {
      const pageInfo = rootElement as BasePage;
      this.page = pageInfo.page;
      this.options = { visual: pageInfo.visual };
      return;
    }
    this.page = rootElement as Page;
  }
}
