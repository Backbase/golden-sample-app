import { expect as baseExpect } from '@playwright/test';

type FieldDifference = {
  fieldName: string;
  expected: any;
  actual: any;
};

// Cache for memoized comparisons
const comparisonCache = new Map<string, boolean>();

const getCacheKey = (received: any, expected: any): string => {
  return JSON.stringify({ received, expected });
};

const getFieldDifferences = (received: any, expected: any): FieldDifference[] => {
  const differences: FieldDifference[] = [];

  Object.entries(expected).forEach(([key, expectedValue]) => {
    const receivedValue = received[key];
    if (receivedValue !== expectedValue) {
      differences.push({
        fieldName: key,
        expected: expectedValue,
        actual: receivedValue
      });
    }
  });

  return differences;
};

const getMissingFields = (received: any, expected: any): string[] => {
  return Object.keys(expected).filter(key => !(key in received));
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

  // Filter out undefined fields from expected
  const definedExpected = Object.fromEntries(
    Object.entries(expected).filter(([_, value]) => value !== undefined)
  );

  const receivedKeys = Object.keys(received);
  const expectedKeys = Object.keys(definedExpected);

  if (receivedKeys.length !== expectedKeys.length) {
    comparisonCache.set(cacheKey, false);
    return false;
  }

  const result = expectedKeys.every(key => {
    if (!(key in received)) return false;
    return deepCompare(received[key], definedExpected[key]);
  });

  comparisonCache.set(cacheKey, result);
  return result;
};

const formatDifferencesTable = (differences: FieldDifference[]): string => {
  if (differences.length === 0) return '';

  const header = '| Field Name | Expected | Actual |\n|------------|----------|--------|\n';
  const rows = differences.map(diff => 
    `| ${diff.fieldName} | ${JSON.stringify(diff.expected)} | ${JSON.stringify(diff.actual)} |`
  ).join('\n');

  return header + rows;
};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveObject(expected: object | object[]): R;
    }
  }
}

export const expect = baseExpect.extend({
  async toHaveObject(
    received: (() => Promise<object | object[]>) | Promise<(() => object | object[])>,
    expected: object | object[]
  ): Promise<{ message: () => string; pass: boolean }> {
    // Clear cache before each comparison to prevent memory leaks
    comparisonCache.clear();

    // Await the received value
    const actualValue: object | object[] = typeof received === 'function' ? await received() : await received;
    const actualArray = Array.isArray(actualValue) ? actualValue : [actualValue];
    const isSingleObject = !Array.isArray(expected);
    const expectedArray = isSingleObject ? [expected] : expected;

    if (actualArray.length === 0) {
      return {
        message: () => isSingleObject 
          ? `Expected object but got empty result`
          : `Expected non-empty array but got empty array`,
        pass: false,
      };
    }

    // Compare all objects and store results
    const comparisonResults = expectedArray.map(expectedObj => {
      const matches = actualArray.some(receivedObj => 
        deepCompare(receivedObj, { ...expectedObj })
      );
      return {
        expected: expectedObj,
        matches
      };
    });

    const allMatch = comparisonResults.every(result => result.matches);

    if (allMatch) {
      return {
        message: () => isSingleObject
          ? `Object matches expected: ${JSON.stringify(expected)}`
          : `Array contains object(s) matching: ${JSON.stringify(expected)}`,
        pass: true,
      };
    }

    // Find the first non-matching object for error message
    const firstNonMatch = comparisonResults.find(result => !result.matches)!;
    const { expected: expectedFields } = firstNonMatch;

    const missingFields = getMissingFields(actualArray[0], expectedFields);
    const fieldDifferences = getFieldDifferences(actualArray[0], expectedFields);

    const errorMessage = [
      isSingleObject 
        ? `Objects do not match.`
        : `Expected object(s) not found in the array.`,
      missingFields.length > 0 ? `\nMissing fields: ${missingFields.join(', ')}` : '',
      fieldDifferences.length > 0 ? `\nField value differences:\n${formatDifferencesTable(fieldDifferences)}` : '',
      `\nExpected object: ${JSON.stringify(expectedFields, null, 2)}`,
      `\nActual objects: ${JSON.stringify(actualArray, null, 2)}`
    ].join('');

    return {
      message: () => errorMessage,
      pass: false,
    };
  }
});
