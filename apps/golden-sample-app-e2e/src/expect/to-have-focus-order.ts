import { Locator, Page, expect as baseExpect } from '@playwright/test';

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
  const { tagName, textContent, innerText } = await page
    .locator(':focus')
    .evaluate((el) => ({
      tagName: el.tagName.toLowerCase(),
      textContent: el.textContent ?? '',
      innerText: (el as HTMLElement).innerText ?? '',
    }));

  return {
    tagName,
    textContent: normalizeText(textContent),
    innerText: normalizeText(innerText),
  };
}

export const focusOrderExpect = baseExpect.extend({
  async toHaveFocusOrder(root: Locator, expected: FocusableElement[]) {
    const page = root.page();
    const actual: FocusableElement[] = [];
    actual.push(await getFocusedElement(page));
    for (let i = 1; i < expected.length; i++) {
      await root.press('Tab');
      actual.push(await getFocusedElement(page));
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
      // Positive result; Playwright inverts automatically for `.not`.
      pass,
      name: 'toHaveFocusOrder',
      message: () =>
        `Expected focus order to match:\n${this.utils.printDiffOrStringify(
          expected,
          actual,
          'expected',
          'actual',
          false
        )}`,
    };
  },
});
