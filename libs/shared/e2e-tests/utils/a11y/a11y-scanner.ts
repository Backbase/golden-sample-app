import { Locator, Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { getSelector } from '../playwright-utils';
import { AxeResults } from 'axe-core';
import { getViolationsNodes, shortA11YReport } from './a11y-violations-utility';
import { createHtmlReport } from 'axe-html-reporter';

export class A11yScanner {
  protected axeBuilder: AxeBuilder;

  results: AxeResults | null = null;

  get violations() {
    return this.results?.violations;
  }

  get hasViolations() {
    return this.results?.violations.length !== 0;
  }

  constructor(
    page: Page,
    protected testInfo: TestInfo,
    options?: { include?: Locator | string; disableRules?: string[] }
  ) {
    this.axeBuilder = new AxeBuilder({ page }).withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
    ]);
    if (options?.disableRules) {
      this.axeBuilder.disableRules(options.disableRules);
    }
    if (options?.include) {
      const selector = getSelector(options.include);
      this.axeBuilder.include(selector);
    }
  }

  async analyze() {
    this.results = await this.axeBuilder.analyze();
    return {
      results: this.results,
      violations: this.violations,
      hasViolations: this.hasViolations,
    };
  }

  async attachResultsToPlaywrightReport() {
    await this.testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(this.results, null, 2),
      contentType: 'application/json',
    });
  }

  saveA11yResultsToFile(fileName: string) {
    createHtmlReport({
      results: this.results,
      options: {
        outputDir: 'accessibility-reports',
        reportFileName: fileName,
      },
    });
  }

  validateResult() {
    return !this.hasViolations
      ? this.passAccessibilityResult
      : this.failedAccessibilityResult;
  }

  passAccessibilityResult = {
    message: () => 'Page have no accessibility issues',
    pass: true,
  };

  get failedAccessibilityResult() {
    const nodes = getViolationsNodes(this.violations);
    // eslint-disable-next-line max-len
    const message = () =>
      `Page have ${this.violations.length} accessibility issues in ${
        nodes.length
      } areas of the html code\nPlease find more details in attachment "accessibility-scan-results"\n${shortA11YReport(
        this.violations
      )}`;
    return {
      message,
      pass: false,
    };
  }
}
