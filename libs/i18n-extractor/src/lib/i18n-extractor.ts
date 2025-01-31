import * as fs from 'fs';
import * as path from 'path';

interface I18nLabel {
  tag: string;
  lineNumber: number;
  fileName: string;
  label: string;
  meaning?: string;
  description?: string;
  id?: string;
  isValid: boolean;
}

export class I18nExtractor {
  private labels: I18nLabel[] = [];

  constructor(private workspacePath: string, private outputPath: string) {}

  /**
   * Main method to extract i18n labels from the workspace
   */
  public async extract(): Promise<void> {
    try {
      // Find all relevant files
      const files = await this.findFiles(this.workspacePath);
      
      // Process each file
      for (const file of files) {
        await this.processFile(file);
      }

      // Write results to output file
      await this.writeResults();
    } catch (error) {
      console.error('Error extracting i18n labels:', error);
      throw error;
    }
  }

  /**
   * Find all relevant files in the workspace
   */
  private async findFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...await this.findFiles(fullPath));
      } else if (
        stat.isFile() && 
        (fullPath.endsWith('.html') || 
         fullPath.endsWith('.ts') || 
         fullPath.endsWith('.component.ts'))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Process a single file to extract i18n labels
   */
  private async processFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativeFilePath = path.relative(this.workspacePath, filePath);

    if (filePath.endsWith('.html')) {
      this.processHtmlFile(lines, relativeFilePath);
    } else if (filePath.endsWith('.ts')) {
      this.processTypeScriptFile(lines, relativeFilePath);
    }
  }

  /**
   * Process HTML file to extract i18n labels
   */
  private processHtmlFile(lines: string[], filePath: string): void {
    const i18nRegex = /i18n="([^"]+)"|i18n-[^=]+=["']([^"']+)["']/g;
    
    lines.forEach((line, index) => {
      let match;
      while ((match = i18nRegex.exec(line)) !== null) {
        const i18nValue = match[1] || match[2];
        const tag = this.extractTag(line);
        const label = this.extractLabel(line);
        
        if (i18nValue && tag && label) {
          const { meaning, description, id } = this.parseI18nValue(i18nValue);
          
          this.labels.push({
            tag,
            lineNumber: index + 1,
            fileName: filePath,
            label,
            meaning,
            description,
            id,
            isValid: this.isValidHtmlFormat(i18nValue)
          });
        }
      }
    });
  }

  /**
   * Process TypeScript file to extract i18n labels
   */
  private processTypeScriptFile(lines: string[], filePath: string): void {
    const localizeRegex = /\$localize`:[^`]+`/g;
    
    lines.forEach((line, index) => {
      let match;
      while ((match = localizeRegex.exec(line)) !== null) {
        const localizeValue = match[0];
        const { meaning, description, id, label } = this.parseLocalizeValue(localizeValue);
        
        if (label) {
          this.labels.push({
            tag: localizeValue,
            lineNumber: index + 1,
            fileName: filePath,
            label,
            meaning,
            description,
            id,
            isValid: this.isValidTypeScriptFormat(localizeValue)
          });
        }
      }
    });
  }

  /**
   * Extract the full tag from a line of HTML
   */
  private extractTag(line: string): string {
    const tagRegex = /<[^>]+>/;
    const match = line.match(tagRegex);
    return match ? match[0] : line.trim();
  }

  /**
   * Extract the label text from a line of HTML
   */
  private extractLabel(line: string): string {
    const labelRegex = />([^<]+)</;
    const match = line.match(labelRegex);
    return match ? match[1].trim() : '';
  }

  /**
   * Parse i18n value from HTML format
   */
  private parseI18nValue(value: string): { meaning?: string; description?: string; id?: string } {
    const parts = value.split('@@');
    const id = parts[1];
    
    if (parts[0].includes('|')) {
      const [meaning, description] = parts[0].split('|');
      return { meaning: meaning.trim(), description: description.trim(), id };
    }
    
    return { id };
  }

  /**
   * Parse $localize value from TypeScript format
   */
  private parseLocalizeValue(value: string): { meaning?: string; description?: string; id?: string; label: string } {
    // Remove $localize and backticks
    const content = value.slice(10, -1);
    const [meta, label] = content.split(':').map(s => s.trim());
    
    const parts = meta.split('@@');
    const id = parts[1];
    
    if (parts[0].includes('|')) {
      const [meaning, description] = parts[0].split('|');
      return { meaning: meaning.trim(), description: description.trim(), id, label };
    }
    
    return { id, label };
  }

  /**
   * Check if HTML i18n format is valid
   */
  private isValidHtmlFormat(value: string): boolean {
    return value.includes('|') && value.includes('@@');
  }

  /**
   * Check if TypeScript $localize format is valid
   */
  private isValidTypeScriptFormat(value: string): boolean {
    return value.startsWith('$localize`:') && 
           value.includes('|') && 
           value.includes('@@') && 
           value.endsWith('`');
  }

  /**
   * Write results to output file
   */
  private async writeResults(): Promise<void> {
    const outputDir = path.dirname(this.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const content = JSON.stringify(this.labels, null, 2);
    fs.writeFileSync(this.outputPath, content, 'utf-8');
  }
}
