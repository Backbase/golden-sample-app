import { User } from './data/data-types/user';
import config from '../../playwright.config';
import 'dotenv/config';

export class TestConfig {
  baseUrl: string = config.use?.baseURL || 'BASE URL UNDEFINED';
  locale: string = 'en';

  appBaseUrl() {
    return this.baseUrl;
  }

  init(
    options: Partial<{ user: User; url: string; }> = {
      url: this.baseUrl,
    },
  ) {
    if (options.url) {
      this.baseUrl = options.url;
    }
  }
}
export const testConfig = new TestConfig();
