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

const getFieldDifferences = (
  received: any,
  expected: any
): FieldDifference[] => {
  const differences: FieldDifference[] = [];

  // Only check fields that are defined in expected
  Object.entries(expected)
    .filter(([_, value]) => value !== undefined)
    .forEach(([key, expectedValue]) => {
      const receivedValue = received[key];
      if (receivedValue !== expectedValue) {
        differences.push({
          fieldName: key,
          expected: expectedValue,
          actual: receivedValue,
        });
      }
    });

  return differences;
};

const getMissingFields = (received: any, expected: any): string[] => {
  // Only check for fields that are defined in expected
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

  // Filter out undefined fields from expected
  const definedExpected = Object.fromEntries(
    Object.entries(expected).filter(([_, value]) => value !== undefined)
  );

  const expectedKeys = Object.keys(definedExpected);

  const result = expectedKeys.every((key) => {
    if (!(key in received)) return false;
    return deepCompare(received[key], definedExpected[key]);
  });

  comparisonCache.set(cacheKey, result);
  return result;
};

const formatValue = (value: any): string =>
  JSON.stringify(value, null, 2).replace(/"([^"]+)":/g, '$1:');

const formatDifferencesTable = (differences: FieldDifference[]): string => {
  if (differences.length === 0) return '';

  const header =
    '| Field Name | Expected | Actual |\n|------------|----------|--------|\n';
  const rows = differences
    .map((diff) => {
      return `| ${diff.fieldName} | ${formatValue(
        diff.expected
      )} | ${formatValue(diff.actual)} |`;
    })
    .join('\n');

  return header + rows;
};

const errorResult = (
  message: string
): { pass: false; message: () => string } => ({
  pass: false,
  message: () => message,
});

const successResult = (
  message: string
): { pass: true; message: () => string } => ({
  pass: true,
  message: () => message,
});

const compareSingleObject = <T extends object>(
  actual: T,
  expected: T
): { pass: boolean; message: () => string } => {
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

const compareObjectArray = <T extends object>(
  actual: T[],
  expected: T[],
  strict: boolean = true
): { pass: boolean; message: () => string } => {
  if (strict && actual.length !== expected.length) {
    return errorResult(
      `Expected array length ${expected.length} but got ${
        actual.length
      }\nActual objects: ${formatValue(actual)}`
    );
  }

  if (actual.length === 0 && expected.length === 0) {
    return successResult('Empty arrays match');
  }

  const comparisonResults = expected.map((expectedObj) => {
    const matches = actual.some((actualObj) =>
      deepCompare(actualObj, expectedObj)
    );
    return { expected: expectedObj, matches };
  });

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

export { compareSingleObject, compareObjectArray, errorResult, successResult };
