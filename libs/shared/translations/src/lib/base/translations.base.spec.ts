import { TranslationsBase } from './translations.base';
import { TranslationRecord } from '../types/translations.types';

interface MockTranslationRecord extends TranslationRecord {
  key1: string;
  key2: string;
}

class MockTranslations extends TranslationsBase<MockTranslationRecord> {}

describe('TranslationsBase', () => {
  const defaultTranslations: MockTranslationRecord = {
    key1: 'default value 1',
    key2: 'default value 2',
  };

  it('should use default translations when custom translations are null', () => {
    const translations = new MockTranslations(defaultTranslations, null);
    expect(translations.translations).toEqual(defaultTranslations);
  });

  it('should merge custom translations with default translations', () => {
    const customTranslations: Partial<MockTranslationRecord> = {
      key1: 'custom value 1',
    };
    const expectedTranslations: MockTranslationRecord = {
      key1: 'custom value 1',
      key2: 'default value 2',
    };
    const translations = new MockTranslations(
      defaultTranslations,
      customTranslations
    );
    expect(translations.translations).toEqual(expectedTranslations);
  });

  it('should use default value if custom translation key is undefined', () => {
    const customTranslations: Partial<MockTranslationRecord> = {
      key1: undefined,
    };
    const expectedTranslations: MockTranslationRecord = {
      key1: 'default value 1',
      key2: 'default value 2',
    };
    const translations = new MockTranslations(
      defaultTranslations,
      customTranslations
    );
    expect(translations.translations).toEqual(expectedTranslations);
  });
});
