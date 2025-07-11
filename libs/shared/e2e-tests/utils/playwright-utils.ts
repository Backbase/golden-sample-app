import { Locator, Page } from '@playwright/test';

export const isLocator = (param: any): param is Locator =>
  typeof param === 'object' && /locator\('.*'\)/g.test(param.toString());

export const getPage = (root: Page | Locator): Page =>
  isLocator(root) ? root.page() : root;

export function getSelector(locator?: string | Locator): string {
  if (!locator) return '';
  if (typeof locator === 'string') return locator;

  const locatorAsString = locator.toString();
  const index = locatorAsString.indexOf('@') + 1;

  return locatorAsString.substring(index);
}

export async function getLocatorText(element: Locator): Promise<string> {
  return (await element.textContent())?.trim() ?? '';
}

export async function getTrimmedText(element: Locator): Promise<string> {
  const text = await element.textContent();
  return text?.trim() ?? '';
}
