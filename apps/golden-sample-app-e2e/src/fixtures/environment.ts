export enum TestEnvironment {
  MOCKS = 'mocks',
  SANDBOX = 'sandbox',
  EPHEMERAL = 'ephemeral',
  MODELBANK_STAGING = 'mb-stg',
}

export interface EnvironmentConfig {
  headerKey?: string;
  headerValue?: string;
  users?: {
    [key: string]: {
      username: string;
      password: string;
      fullName: string;
    };
  };
}

/**
 * Project-specific test arguments.
 *
 * Different projects can be configured in the playwright.config.*.ts files that target different environments.
 * The projects will configure the test runner using these properties accordingly.
 */
export interface ProjectTestArgs {
  /**
   * Configuration specific to the target environment.
   */
  environmentConfig: EnvironmentConfig;
  /**
   * Whether to mock network requests.
   */
  useMocks: boolean;
}
