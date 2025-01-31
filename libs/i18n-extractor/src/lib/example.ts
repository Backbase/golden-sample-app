import { I18nExtractor } from './i18n-extractor';

async function extractI18nLabels(workspacePath: string, outputPath: string): Promise<void> {
  try {
    const extractor = new I18nExtractor(workspacePath, outputPath);
    await extractor.extract();
    console.log(`I18n labels have been extracted and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error extracting i18n labels:', error);
  }
}

// Example usage:
// extractI18nLabels('/path/to/workspace', '/path/to/output/i18n-labels.json');