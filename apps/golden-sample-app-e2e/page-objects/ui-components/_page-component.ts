import { Locator, Page } from '@playwright/test';

export abstract class PageComponent {
  constructor(protected page: Page) {}

  $(
    selector: string,
    options?: {
      has?: Locator;
      hasNot?: Locator;
      hasNotText?: string | RegExp;
      hasText?: string | RegExp;
    },
  ): Locator {
    return this.page.locator(selector, options);
  }
}
