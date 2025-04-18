import { Locator, Page, TestInfo } from '@playwright/test';
import { VisualValidator } from '../utils';

export interface PageInfo {
  page: Page;
  visual: VisualValidator;
  testInfo?: TestInfo;
  locator(selector: string, options?: { hasText: string }): Locator;
  byTestId(selector: string, options?: { hasText: string }): Locator;
}
