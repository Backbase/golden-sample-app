import { Locator } from '@playwright/test';

export const isLocator = (param: any): param is Locator =>
  typeof param === 'object' && param.toString().split('@')[0] === 'Locator';
