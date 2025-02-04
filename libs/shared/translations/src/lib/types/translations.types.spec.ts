import { TranslationRecord } from './translations.types';

describe('TranslationRecord', () => {
  it('should allow string keys and string values', () => {
    const record: TranslationRecord = {
      key1: 'value1',
      key2: 'value2',
    };
    expect(record['key1']).toBe('value1');
    expect(record['key2']).toBe('value2');
  });

  it('should not allow non-string values', () => {
    const record: TranslationRecord = {
      // @ts-expect-error: Testing non-string values
      key1: 123,
    };
    expect(record['key']).toBeUndefined();
  });

  it('should allow empty record', () => {
    const record: TranslationRecord = {};
    expect(Object.keys(record).length).toBe(0);
  });
});