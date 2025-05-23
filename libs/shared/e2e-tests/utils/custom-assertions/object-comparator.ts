import { Locator } from '@playwright/test';

type FieldDifference = {
  fieldName: string;
  expected: any;
  actual: any;
};

type ComparisonResult = {
  pass: boolean;
  message: () => string;
};

// Cache for memoized comparisons
const comparisonCache = new Map<string, boolean>();

const getCacheKey = (received: any, expected: any): string => {
  return JSON.stringify({ received, expected });
};

const getFieldDifferences = (
  received: any,
  expected: any
): FieldDifference[] => {
  return Object.entries(expected)
    .filter(([_, value]) => value !== undefined)
    .reduce<FieldDifference[]>((differences, [key, expectedValue]) => {
      const receivedValue = received[key];
      if (receivedValue !== expectedValue) {
        differences.push({
          fieldName: key,
          expected: expectedValue,
          actual: receivedValue,
        });
      }
      return differences;
    }, []);
};

const getMissingFields = (received: any, expected: any): string[] => {
  return Object.entries(expected)
    .filter(([_, value]) => value !== undefined)
    .map(([key]) => key)
    .filter((key) => !(key in received));
};

const deepCompare = (received: any, expected: any): boolean => {
  const cacheKey = getCacheKey(received, expected);

  if (comparisonCache.has(cacheKey)) {
    return comparisonCache.get(cacheKey)!;
  }

  if (typeof received !== typeof expected) {
    comparisonCache.set(cacheKey, false);
    return false;
  }

  if (typeof received !== 'object' || received === null) {
    const result = received === expected;
    comparisonCache.set(cacheKey, result);
    return result;
  }

  const definedExpected = Object.fromEntries(
    Object.entries(expected).filter(([_, value]) => value !== undefined)
  );

  const result = Object.keys(definedExpected).every((key) => {
    if (!(key in received)) return false;
    return deepCompare(received[key], definedExpected[key]);
  });

  comparisonCache.set(cacheKey, result);
  return result;
};

const formatValue = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value !== 'object') {
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(', ')}]`;
  }

  return JSON.stringify(value, null, 2).replace(/"([^"]+)":/g, '$1:');
};

const formatDifferencesTable = (differences: FieldDifference[]): string => {
  if (differences.length === 0) return '';

  const header =
    '| Field Name | Expected | Actual |\n|------------|----------|--------|\n';
  const rows = differences
    .map(
      (diff) =>
        `| ${diff.fieldName} | ${formatValue(diff.expected)} | ${formatValue(
          diff.actual
        )} |`
    )
    .join('\n');

  return header + rows;
};

const successResult = (message: string): ComparisonResult => ({
  pass: true,
  message: () => message,
});

const errorResult = (message: string): ComparisonResult => ({
  pass: false,
  message: () => message,
});

const getLocatorValue = async <T>(locator: Locator): Promise<T | T[]> => {
  const count = await locator.count();
  if (count === 0) {
    return [] as unknown as T[];
  }
  if (count === 1) {
    const text = await locator.textContent();
    return text?.trim() as unknown as T;
  }
  const texts = await locator.allTextContents();
  return texts as unknown as T[];
};

const getActualValue = async <T>(
  received: (() => Promise<T | T[]>) | Promise<T | T[]> | Locator
): Promise<T | T[]> => {
  if ('count' in received) {
    return getLocatorValue<T>(received);
  }
  return typeof received === 'function' ? await received() : await received;
};

const compareSingleObject = <T>(actual: T, expected: T): ComparisonResult => {
  if (typeof actual !== 'object' || actual === null) {
    const matches = actual === expected;
    if (matches) {
      return successResult(`Value matches expected: ${formatValue(expected)}`);
    }
    return errorResult(
      `Values do not match.\nExpected: ${formatValue(
        expected
      )}\nActual: ${formatValue(actual)}`
    );
  }

  if (Object.keys(actual).length === 0) {
    return errorResult('Expected object but got empty result');
  }

  const matches = deepCompare(actual, expected);
  if (matches) {
    return successResult(`Object matches expected: ${formatValue(expected)}`);
  }

  const missingFields = getMissingFields(actual, expected);
  const fieldDifferences = getFieldDifferences(actual, expected);

  const errorMessage = [
    'Objects do not match.',
    missingFields.length > 0
      ? `\nMissing fields: ${missingFields.join(', ')}`
      : '',
    fieldDifferences.length > 0
      ? `\nField value differences:\n${formatDifferencesTable(
          fieldDifferences
        )}`
      : '',
    `\nExpected object: ${formatValue(expected)}`,
    `\nActual object: ${formatValue(actual)}`,
  ].join('');

  return errorResult(errorMessage);
};

const compareObjectArray = <T>(
  actual: T[],
  expected: T[],
  strict: boolean = true
): ComparisonResult => {
  if (strict && actual.length !== expected.length) {
    return errorResult(
      `Expected array length ${expected.length} but got ${
        actual.length
      }\nActual values: ${formatValue(actual)}`
    );
  }

  if (actual.length === 0 && expected.length === 0) {
    return successResult('Empty arrays match');
  }

  if (typeof actual[0] !== 'object' || actual[0] === null) {
    const allMatch = expected.every((expectedVal) =>
      actual.some((actualVal) => {
        if (typeof actualVal === 'string' && typeof expectedVal === 'string') {
          return actualVal.trim() === expectedVal.trim();
        }
        return actualVal === expectedVal;
      })
    );

    if (allMatch) {
      return successResult(
        `Array contains value(s) matching: ${formatValue(expected)}`
      );
    }

    return errorResult(
      `Expected values: ${formatValue(expected)}\nActual values: ${formatValue(
        actual
      )}`
    );
  }

  const comparisonResults = expected.map((expectedObj) => ({
    expected: expectedObj,
    matches: actual.some((actualObj) => deepCompare(actualObj, expectedObj)),
  }));

  const allMatch = comparisonResults.every((result) => result.matches);
  if (allMatch) {
    return successResult(
      `Array contains object(s) matching: ${formatValue(expected)}`
    );
  }

  const firstNonMatch = comparisonResults.find((result) => !result.matches)!;
  const { expected: expectedFields } = firstNonMatch;

  const missingFields = getMissingFields(actual[0], expectedFields);
  const fieldDifferences = getFieldDifferences(actual[0], expectedFields);

  const errorMessage = [
    'Expected object(s) not found in the array.',
    missingFields.length > 0
      ? `\nMissing fields: ${missingFields.join(', ')}`
      : '',
    fieldDifferences.length > 0
      ? `\nField value differences:\n${formatDifferencesTable(
          fieldDifferences
        )}`
      : '',
    `\nExpected object: ${formatValue(expectedFields)}`,
    `\nActual objects: ${formatValue(actual)}`,
  ].join('');

  return errorResult(errorMessage);
};

export const clearComparisonCache = () => comparisonCache.clear();

export {
  compareSingleObject,
  compareObjectArray,
  errorResult,
  successResult,
  formatValue,
  getActualValue,
};
