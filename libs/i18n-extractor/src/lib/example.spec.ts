import { I18nExtractor } from './i18n-extractor';
import * as fs from 'fs';

// Mock the entire i18n-extractor module
jest.mock('./i18n-extractor');
jest.mock('fs');

describe('I18n Extractor Example Usage', () => {
  const mockWorkspacePath = '/test/workspace';
  const mockOutputPath = '/test/output/i18n-labels.json';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should demonstrate successful extraction', async () => {
    // Mock successful extraction
    (I18nExtractor as jest.Mock).mockImplementation(() => ({
      extract: jest.fn().mockResolvedValue(undefined)
    }));

    const extractor = new I18nExtractor(mockWorkspacePath, mockOutputPath);
    await extractor.extract();

    expect(I18nExtractor).toHaveBeenCalledWith(mockWorkspacePath, mockOutputPath);
    expect(extractor.extract).toHaveBeenCalled();
  });

  it('should handle extraction errors', async () => {
    // Mock extraction error
    (I18nExtractor as jest.Mock).mockImplementation(() => ({
      extract: jest.fn().mockRejectedValue(new Error('Extraction failed'))
    }));

    const extractor = new I18nExtractor(mockWorkspacePath, mockOutputPath);
    await expect(extractor.extract()).rejects.toThrow('Extraction failed');
  });

  it('should handle file system errors', async () => {
    // Mock file system error
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File system error');
    });

    const extractor = new I18nExtractor(mockWorkspacePath, mockOutputPath);
    await expect(extractor.extract()).rejects.toThrow('File system error');
  });
});