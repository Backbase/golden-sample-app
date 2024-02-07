import { expect, Locator } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected root: Locator) {}

  $(
    selector: string | Locator,
    options?: {
      has?: Locator;
      hasNot?: Locator;
      hasNotText?: string | RegExp;
      hasText?: string | RegExp;
    },
  ): Locator {
    return this.root.locator(selector, options);
  }

  async toBeVisible() {
    await expect(this.root).toBeVisible();
  }
  async toBeHidden() {
    await expect(this.root).not.toBeVisible();
  }
}
