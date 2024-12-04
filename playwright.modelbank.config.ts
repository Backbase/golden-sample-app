import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import baseConfig from './playwright.config';
import { join } from 'path';



export default defineConfig<any>({
  ...baseConfig,
  projects: [
    {
      name: 'remote-ephemeral',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'src/config/ephemeral.config.json'),
        baseURL: process.env.REMOTE_URL || 'http://localhost:4200',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // temporary solution until all other files are prefixed with "mocked-"
    },
    {
      name: 'remote-bus-stg',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'src/config/bus-stg.config.json'),
        baseURL: 'https://business.bus-stg.reference.azure.backbaseservices.com',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // temporary solution until all other files are prefixed with "mocked-"
    },
    {
      name: 'remote-bus-stable',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'src/config/bus-stable.config.json'),
        baseURL: 'https://business.bus-stable.reference.azure.backbaseservices.com',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // temporary solution until all other files are prefixed with "mocked-"
    },
    {
      name: 'remote-us-latest',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1723, height: 896 },
        configPath: join(__dirname, 'src/config/us-latest.config.json'),
        baseURL: 'https://business.us-latest.rndbb.azure.backbaseservices.com',
      },
      testMatch: /mb-.*\.(e2e-spec|spec)\.ts/, // temporary solution until all other files are prefixed with "mocked-"
    },
  ],
})
