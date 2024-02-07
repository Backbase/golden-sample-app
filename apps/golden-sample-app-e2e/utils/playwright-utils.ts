import { Locator } from '@playwright/test';

export const isLocator = (param: any): param is Locator =>
  typeof param === 'object' && param.toString().split('@')[0] === 'Locator';

export const getSelector = (locator?: string | Locator): string => {
  if (!locator) return '';
  if (typeof locator === 'string') return locator;

  const locatorAsString = locator.toString();
  const index = locatorAsString.indexOf('@') + 1;

  return locatorAsString.substring(index);
};
