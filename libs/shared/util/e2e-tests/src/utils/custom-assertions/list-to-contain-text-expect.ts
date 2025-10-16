import { expect as baseExpect, Locator } from '@playwright/test';
import { successResult, errorResult } from './object-comparator';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      listToContainText(expectedText: string, caseSensitive?: boolean): R;
    }
  }
}

export const listContainExpect = baseExpect.extend({
  async listToContainText(
    locator: Locator,
    expectedText: string,
    caseSensitive?: boolean
  ): Promise<{ message: () => string; pass: boolean }> {
    const count = await locator.count();
    if (count === 0) {
      return errorResult('No elements found for the given locator');
    }

    const invalidTexts: { index: number; text: string }[] = [];
    const searchTerm = caseSensitive
      ? expectedText
      : expectedText.toLowerCase();

    for (let i = 0; i < count; i++) {
      const element = locator.nth(i);
      const text = (await element.textContent())?.trim() ?? '';
      const searchText = caseSensitive ? text : text.toLowerCase();

      if (!searchText.includes(searchTerm)) {
        invalidTexts.push({ index: i, text });
      }
    }

    if (invalidTexts.length > 0) {
      const invalidTextsList = invalidTexts
        .map(({ index, text }) => `  - Element at index ${index}: "${text}"`)
        .join('\n');

      return errorResult(
        `The following elements do not contain text "${expectedText}"${
          caseSensitive ? ' (case sensitive)' : ''
        }:\n${invalidTextsList}`
      );
    }

    return successResult(
      `All elements contain text "${expectedText}"${
        caseSensitive ? ' (case sensitive)' : ''
      }`
    );
  },
});
