import {
  Constructor,
  InjectorLike,
  TranslationRecord,
  WithTranslationsInterface,
} from '../types/translations.types';

export function WithTranslations<T extends TranslationRecord>(
  defaultTranslations: T,
  injectionToken: unknown
) {
  return function <C extends Constructor<unknown>>(target: C): C {
    const originalConstructor = target;

    const newConstructor = function (...args: unknown[]) {
      const instance = new originalConstructor(...args);

      // Find the injector in constructor args
      const injectorArg = args.find(
        (arg): arg is InjectorLike =>
          arg !== null && typeof arg === 'object' && 'get' in arg
      );

      // Get translations from injector
      const customTranslations = injectorArg?.get(injectionToken) as Partial<T>;

      // Set up translations property
      (instance as WithTranslationsInterface<T>).translations = {
        ...defaultTranslations,
        ...(customTranslations &&
          Object.keys(customTranslations).reduce<Partial<T>>(
            (acc, key) => ({
              ...acc,
              [key]: customTranslations[key] ?? defaultTranslations[key],
            }),
            {}
          )),
      };

      return instance;
    };

    // Copy prototype
    newConstructor.prototype = originalConstructor.prototype;

    return newConstructor as unknown as C;
  };
}
