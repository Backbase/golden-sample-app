import { Page, expect as baseExpect } from '@playwright/test';

export type FocusableElement = {
  tagName: string;
  textContent?: string;
  innerText?: string;
};

/** Collapse whitespace — innerText() uses block boundaries; exact spacing is not stable. */
function normalizeText(text: string): string {
  if (!text) {
    return '';
  }
  return text.replace(/\s+/g, ' ').trim();
}

async function getFocusedElement(page: Page): Promise<FocusableElement> {
  const focusedElement = page.locator(':focus');
  const textContent = await focusedElement.textContent();
  const innerText = await focusedElement.innerText();
  // const ariaSnapshot = await focusedElement.ariaSnapshot();
  const tag = await focusedElement.evaluate((el) => el.tagName.toLowerCase());
  return {
    tagName: tag,
    textContent: normalizeText(textContent ?? ''),
    innerText: normalizeText(innerText ?? ''),
  };
}

export const focusOrderExpect = baseExpect.extend({
  async toHaveFocusOrder(page: Page, expected: FocusableElement[]) {
    const actual: FocusableElement[] = [];
    for (let i = 0; i < expected.length; i++) {
      await page.keyboard.press('Tab');

      const currentFocus = await getFocusedElement(page);
      actual.push(currentFocus);
    }

    const pass =
      actual.length === expected.length &&
      actual.every((el, idx) => {
        const sameTag = el.tagName === expected[idx].tagName;

        if (expected[idx].textContent) {
          return (
            sameTag && el.textContent?.startsWith(expected[idx].textContent)
          );
        }
        if (expected[idx].innerText) {
          return sameTag && el.innerText?.startsWith(expected[idx].innerText);
        }
        return sameTag;
      });

    return {
      pass: this.isNot ? !pass : pass,
      name: 'toHaveFocusOrder',
      message: () =>
        `Expected different focus order ${this.utils.printDiffOrStringify(
          expected,
          actual,
          'expected',
          'actual',
          false
        )}`,
    };
  },
});
