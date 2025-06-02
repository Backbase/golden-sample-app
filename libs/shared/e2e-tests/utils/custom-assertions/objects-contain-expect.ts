import { expect as baseExpect, Locator } from '@playwright/test';
import {
  compareObjectArray,
  clearComparisonCache,
  getActualValue,
} from './object-comparator';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toContainObject<T>(expected: T | T[]): R;
    }
  }
}

export const objectContainExpect = baseExpect.extend({
  async toContainObject<T>(
    received: (() => Promise<T[]>) | Promise<T[]> | Locator,
    expected: T | T[]
  ): Promise<{ message: () => string; pass: boolean }> {
    const actualValue = (await getActualValue<T>(received)) as T[];
    const expectedArray = Array.isArray(expected) ? expected : [expected];

    clearComparisonCache();
    return compareObjectArray(actualValue, expectedArray, false);
  },
});
