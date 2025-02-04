export type TranslationRecord = Record<string, string>;

export type Constructor<T> = new (...args: unknown[]) => T;

export interface WithTranslationsInterface<T extends TranslationRecord> {
  translations: T;
}

export interface InjectorLike {
  get<T>(token: T): unknown;
}
