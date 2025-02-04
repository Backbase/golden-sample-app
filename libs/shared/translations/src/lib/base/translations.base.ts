import { TranslationRecord } from '../types/translations.types';

export abstract class TranslationsBase<T extends TranslationRecord> {
  public readonly translations: T;

  constructor(defaultTranslations: T, customTranslations: Partial<T> | null) {
    this.translations = {
      ...defaultTranslations,
      ...(customTranslations &&
        Object.keys(customTranslations).reduce<Partial<T>>(
          (acc, key) => ({
            ...acc,
            [key]:
              customTranslations[key as keyof T] ??
              defaultTranslations[key as keyof T],
          }),
          {}
        )),
    } as T;
  }
}
