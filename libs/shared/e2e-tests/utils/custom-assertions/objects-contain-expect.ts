import { expect as baseExpect } from '@playwright/test';
import { compareObjectArray, clearComparisonCache } from './object-comparator';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toContainObject<T extends object>(expected: T | T[]): R;
    }
  }
}

const expect = baseExpect.extend({
  async toContainObject<T extends object>(
    received: (() => Promise<T[]>) | Promise<T[]>,
    expected: T | T[]
  ): Promise<{ message: () => string; pass: boolean }> {
    const actualValue: T[] =
      typeof received === 'function' ? await received() : await received;
    const expectedArray = Array.isArray(expected) ? expected : [expected];

    clearComparisonCache();
    return compareObjectArray(actualValue, expectedArray, false);
  },
});
