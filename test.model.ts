export interface TestOptions {
  configPath: string;
}

export enum TestEnvironment {
  MOCKS= 'mocks',
  SANDBOX = 'sandbox',
  EPHEMERAL = 'ephemeral',
  MODELBANK_STAGING = 'mb-stg'
}
