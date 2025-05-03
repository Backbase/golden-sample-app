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

export async function collectDataByTestId<
  T extends Record<string, any> = Record<string, any>
>(
  page: Page,
  testIds: string[],
  getContent: (element: Locator) => Promise<any> = (element) =>
    element.textContent()
): Promise<T> {
  const elements: Locator[] = testIds.map((testId) => page.getByTestId(testId));
  const contents: (string | null)[] = (
    await Promise.all(elements.map(getContent))
  ).filter((value) => value?.trim() ?? '');
  return Object.fromEntries(
    testIds.map((testId, i) => [testId, contents[i] || undefined])
  ) as T;
}

export function formatData<T extends Record<string, any>>(
  data: T,
  formatters: Map<string, (value: any) => string>
): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      formatters.has(key) && value !== undefined
        ? formatters.get(key)!(value)
        : value,
    ])
  ) as T;
}
