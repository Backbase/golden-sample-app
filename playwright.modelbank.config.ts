import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import baseConfig from './playwright.config';
import { join } from 'path';



export default defineConfig<any>({
  ...baseConfig,
  projects: [
    /**
     * Configuration for running tests on ephemeral environment.
     */
    {
      name: 'remote-ephemeral',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'apps/golden-sample-app-e2e/config/ephemeral.config.json'), // config for login details
      },
      testIgnore: /mocked-.*/, // we want to run every test here except mocked ones
    },
    /**
     * Configuration for modelbank staging env.
     */
    {
      name: 'remote-mb-stg',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'apps/golden-sample-app-e2e/config/mb-stg.config.json'),
        baseURL: process.env['REMOTE_URL'] ?? 'https://business.mb-stg.reference.azure.backbaseservices.com',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // we just want to run all tests with file names starting from  mb-*.ts.
    },
    /**
     * Configuration for modelbank stable env.
     */
    {
      name: 'remote-mb-stable',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'src/config/mb-stable.config.json'),
        baseURL: process.env['REMOTE_URL'] ?? 'https://business.mb-stable.reference.azure.backbaseservices.com',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // we just want to run all tests with file names starting from  mb-*.ts.
    },
    /**
     * Configuration for US latest env.
     */
    {
      name: 'remote-us-latest',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'src/config/us-latest.config.json'),
        baseURL: process.env['REMOTE_URL'] ?? 'https://business.us-latest.rndbb.azure.backbaseservices.com',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // we just want to run all tests with file names starting from  mb-*.ts.
    },
  ],
})
