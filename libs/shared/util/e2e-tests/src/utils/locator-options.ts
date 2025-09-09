import { Locator } from '@playwright/test';

export interface LocatorOptions {
  has?: Locator;
  hasNot?: Locator;
  hasNotText?: string | RegExp;
  hasText?: string | RegExp;
}
