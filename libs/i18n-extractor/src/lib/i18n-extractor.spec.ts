import { I18nExtractor } from './i18n-extractor';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('I18nExtractor', () => {
  let extractor: I18nExtractor;
  const mockWorkspacePath = '/test/workspace';
  const mockOutputPath = '/test/output/i18n-labels.json';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    extractor = new I18nExtractor(mockWorkspacePath, mockOutputPath);

    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock path.relative to return predictable relative paths
    (path.relative as jest.Mock).mockImplementation((from, to) => to.replace(from + '/', ''));
    
    // Mock path.dirname to return directory path
    (path.dirname as jest.Mock).mockImplementation((p) => p.substring(0, p.lastIndexOf('/')));
  });

  describe('HTML File Processing', () => {
    it('should extract i18n label from basic HTML tag', async () => {
      const mockHtmlContent = '<button i18n="meaning|description@@buttonId">Click me</button>';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockHtmlContent);
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.html']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1]);
      expect(writtenContent).toHaveLength(1);
      expect(writtenContent[0]).toEqual({
        tag: '<button i18n="meaning|description@@buttonId">Click me</button>',
        lineNumber: 1,
        fileName: 'test.component.html',
        label: 'Click me',
        meaning: 'meaning',
        description: 'description',
        id: 'buttonId',
        isValid: true
      });
    });

    it('should extract i18n-placeholder attribute', async () => {
      const mockHtmlContent = '<input i18n-placeholder="inputHint|Input hint text@@inputHintId" placeholder="Enter value">';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockHtmlContent);
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.html']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1]);
      expect(writtenContent).toHaveLength(1);
      expect(writtenContent[0]).toEqual({
        tag: '<input i18n-placeholder="inputHint|Input hint text@@inputHintId" placeholder="Enter value">',
        lineNumber: 1,
        fileName: 'test.component.html',
        label: 'Enter value',
        meaning: 'inputHint',
        description: 'Input hint text',
        id: 'inputHintId',
        isValid: true
      });
    });

    it('should mark invalid format when missing meaning or description', async () => {
      const mockHtmlContent = '<span i18n="@@spanId">Invalid format</span>';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockHtmlContent);
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.html']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1]);
      expect(writtenContent).toHaveLength(1);
      expect(writtenContent[0].isValid).toBe(false);
    });
  });

  describe('TypeScript File Processing', () => {
    it('should extract $localize template literal', async () => {
      const mockTsContent = 'const title = $localize`:Page title|Main page title@@pageTitle:Welcome`;';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockTsContent);
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.ts']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1]);
      expect(writtenContent).toHaveLength(1);
      expect(writtenContent[0]).toEqual({
        tag: '$localize`:Page title|Main page title@@pageTitle:Welcome`',
        lineNumber: 1,
        fileName: 'test.component.ts',
        label: 'Welcome',
        meaning: 'Page title',
        description: 'Main page title',
        id: 'pageTitle',
        isValid: true
      });
    });

    it('should mark invalid format when $localize is missing required parts', async () => {
      const mockTsContent = 'const title = $localize`:Welcome`;'; // Missing meaning|description@@id
      (fs.readFileSync as jest.Mock).mockReturnValue(mockTsContent);
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.ts']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      expect(fs.writeFileSync).toHaveBeenCalled();
      const writtenContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1]);
      expect(writtenContent).toHaveLength(1);
      expect(writtenContent[0].isValid).toBe(false);
    });
  });

  describe('File System Handling', () => {
    it('should recursively search directories', async () => {
      (fs.readdirSync as jest.Mock)
        .mockReturnValueOnce(['subdir', 'test.component.html'])
        .mockReturnValueOnce(['nested.component.ts']);
      
      (fs.statSync as jest.Mock).mockImplementation((path) => ({
        isDirectory: () => path.includes('subdir'),
        isFile: () => !path.includes('subdir')
      }));

      (fs.readFileSync as jest.Mock).mockReturnValue('');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      // Should have checked both root and subdirectory
      expect(fs.readdirSync).toHaveBeenCalledTimes(2);
    });

    it('should skip node_modules directory', async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['node_modules', 'test.component.html']);
      (fs.statSync as jest.Mock).mockImplementation((path) => ({
        isDirectory: () => path.includes('node_modules'),
        isFile: () => !path.includes('node_modules')
      }));

      (fs.readFileSync as jest.Mock).mockReturnValue('');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      // Should not have entered node_modules directory
      expect(fs.readdirSync).toHaveBeenCalledTimes(1);
    });

    it('should create output directory if it does not exist', async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue([]);
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      await extractor.extract();

      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/output', { recursive: true });
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors', async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.html']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });

      await expect(extractor.extract()).rejects.toThrow('File read error');
    });

    it('should handle file write errors', async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.component.html']);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      (fs.readFileSync as jest.Mock).mockReturnValue('');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File write error');
      });

      await expect(extractor.extract()).rejects.toThrow('File write error');
    });
  });
});