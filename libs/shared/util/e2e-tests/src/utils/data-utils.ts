export function deepCopyObject<T>(original: T): T {
  return JSON.parse(JSON.stringify(original));
}

export const toKebabCase = (text: string): string =>
  text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const toCamelCase = (text: string): string =>
  text
    .toLowerCase()
    .replace(/-./g, (match) => match.charAt(1).toUpperCase())
    .replace(/_./g, (match) => match.charAt(1).toUpperCase());
