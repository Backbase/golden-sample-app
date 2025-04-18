export const rtlScreenName = (name: string) => `${name}.png`;

export const stepNameToKebabCase = (stepName: string): string =>
  stepName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
