import { expect as baseExpect } from '@playwright/test';
import {
  compareSingleObject,
  compareObjectArray,
  errorResult,
  clearComparisonCache,
} from './object-comparator';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveObject<T extends object>(expected: T | T[]): R;
    }
  }
}

const expect = baseExpect.extend({
  async toHaveObject<T extends object>(
    received: (() => Promise<T | T[]>) | Promise<T | T[]>,
    expected: T | T[]
  ): Promise<{ message: () => string; pass: boolean }> {
    const actualValue: T | T[] =
      typeof received === 'function' ? await received() : await received;
    const isExpectedObject = !Array.isArray(expected);
    const isActualArray = Array.isArray(actualValue);

    if (isExpectedObject === isActualArray) {
      return errorResult(
        `Expected ${isExpectedObject ? 'object' : 'array'} but got ${
          isActualArray ? 'array' : 'object'
        }: ${JSON.stringify(actualValue)}`
      );
    }

    clearComparisonCache();
    return isExpectedObject
      ? compareSingleObject(actualValue as T, expected as T)
      : compareObjectArray(actualValue as T[], expected as T[]);
  },
});
