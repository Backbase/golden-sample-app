import { Locator, Page } from '@playwright/test';
import { LocatorOptions } from '../../utils/locator-options';
import { isLocator } from 'apps/golden-sample-app-e2e/utils/playwright-utils';

export abstract class BaseComponent {
  get page(): Page {
    if (isLocator(this.accessor))
      throw new Error('Page is not defined');
    return this.accessor as Page;
  }
  get root(): Locator {
    if (!isLocator(this.accessor))
      throw new Error('Root locator is not defined');
    return this.accessor as Locator;
  }

  constructor(private accessor: Page | Locator) { }

  $(selector: string, options?: LocatorOptions): Locator {
    return this.root.locator(selector, options);
  }
}
