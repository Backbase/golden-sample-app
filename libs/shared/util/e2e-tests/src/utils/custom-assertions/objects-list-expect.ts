import { expect as baseExpect, Locator } from '@playwright/test';
import {
  compareSingleObject,
  compareObjectArray,
  errorResult,
  clearComparisonCache,
  formatValue,
  getActualValue,
} from './object-comparator';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveObject<T>(expected: T | T[]): R;
    }
  }
}

export const objectListExpect = baseExpect.extend({
  async toHaveObject<T>(
    received: (() => Promise<T | T[]>) | Promise<T | T[]> | Locator,
    expected: T | T[]
  ): Promise<{ message: () => string; pass: boolean }> {
    const actualValue = await getActualValue<T>(received);
    const isExpectedObject = !Array.isArray(expected);
    const isActualArray = Array.isArray(actualValue);

    if (isExpectedObject === isActualArray) {
      return errorResult(
        `Expected ${isExpectedObject ? 'object' : 'array'} but got ${
          isActualArray ? 'array' : 'object'
        }: ${formatValue(actualValue)}`
      );
    }

    clearComparisonCache();
    return isExpectedObject
      ? compareSingleObject(actualValue as T, expected as T)
      : compareObjectArray(actualValue as T[], expected as T[]);
  },
});
