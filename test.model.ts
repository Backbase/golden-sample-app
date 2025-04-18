export interface TestOptions{
    configPath: string;
    testEnvironment: TestEnvironment;
}

export enum TestEnvironment {
    MOCKS= 'mocks',
    SANDBOX = 'sandbox',
    EPHEMERAL = 'ephemeral',
    MODELBANK_STAGING = 'mb-stg'
}